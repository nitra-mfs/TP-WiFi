---
tags: Assistants
title: TP WiFi
---

# TP WiFi

:::danger
:warning:**DISCLAIMER** :warning: Toutes les techniques ou attaques décrites dans ce TP sont répréhensibles par la loi. Nous allons pouvoir les mettre en place dans un but pédagogique et avec le consentement de la cible (ici les équipements du labo). Les assistants ne sont pas responsables de l'utilisation de ces ressources dans un cadre extérieur au TP.
:::


# Introduction

Les assistants vous proposent quelques TP qui vont couvrir la sécurité dans les réseaux wireless avec un point de vue offensif. Le premier sujet de cette série portera sur le WiFi.

Le WiFi est l'alternative universelle pour les protocoles wireless de niveau 2. Les normes sont maintenues par la IEEE depuis sa création:

Historique:

|                     | Débit théorique | Débit atteint  | Année |
| ------------------- | --------------- | -------------- | ----- |
| 802.1 1 - WiFi 1    | 11 Mb/s         | 5-7 Mb/s       | 1997  |
| 802.1 1a/b - WiFi 2 | 1.5 Mb/s        | 20 Mb/s        | 1999  |
| 802.1 1g - WiFi 3   | 54 Mb/s         | 31 Mb/s        | 2003  |
| 802.1 1n - WiFi 4   | 54 - 600 Mb/s   | 150 - 200 Mb/s | 2009  |
| 802.1 1ac - WiFi 5  | 3.5 Gb/s        | 1.3 Gb/s       | 2013  |
| 802.1 1ax - WiFi 6  | 10.53 Gb/s      | 6 Gb/s         | 2019  |

C'est du wireless il y a donc une bande de fréquences radio attribuée aux protocoles LAN et donc au WiFi :

![](https://i.imgur.com/JkQ8lwp.png)



Il existe beaucoup de façons de compromettre un réseau WiFi car de nature et par défault, une interface d'un point d'accès est exposée à n'importe qui possédant une interface réseau. Dans ce TP vous allez apprendre à vous introduire dans un équipement WiFi et à l'exploiter pour compromettre les utilisateurs.


---

**Vocabulaire et Topologie**
:::info
**SSID** (Service Set IDentifier) : C'est le nom d'un réseau WiFi, car effectivement plusieurs WLANs (Wireless Local Area Network) peuvent coexister sur un seul espace mais chaque WLAN a besoin d'un nom : le SSID. N'importe quel appareil équipé d'une carte WiFi peut voir les SSIDs de tous les réseaux disponibles.
:::

![](https://i.imgur.com/hJDJqOo.png)


:::info
**BSSID** (Basic Service Set IDentifiers) : Cela identifie les points d'accès et leurs clients. Les paquets du WLAN doivent accéder à leur destinataire, le SSID garde les paquets dans le bon WLAN. Cependant il y a souvent plusieurs points d'accès dans un WLAN, et il faut un moyen de tous les identifier de façon unique, eux et leurs clients associés.
**C'est l'adresse MAC du point d'accès.**
:::

![](https://i.imgur.com/iVs1Nk7.png)


:::info
**ESSID** (Extended Basic Service Set): Désigne tous les BSSs dans un réseau. La plupart du temps ESSID désigne la même chose que le SSID.
:::

:::info
**AD-HOC**: Un réseau ad-hoc ne possède aucun point d'accès. Le flux est juste transmis point-à-point. Dans un réseau ad-hoc on va par exemple avoir une string de 48-bit qui peut remplacer l'adresse MAC. Ce string sera considéré comme un BSSID qui sera inclus dans tous les paquets du réseau.
:::

*Source : Juniper*

---

Pour faire ce TP vous allez avoir besoin d'un [live Kali](https://blog.moulard.org/boot-kali-live/), nous allons utiliser les différents outils : la suite aircrack, airmon, wireshark, bettercap, hostapd, dnsmasq... Vous aurez également besoin d'un ordinateur ayant une carte réseau.

Les ressources dont vous avez besoin se trouveront sur le repo : https://github.com/nitra-mfs/TP-WiFi

:::danger
**On vous conseille de lire l'intégralité du TP avant de commencer.**
:::

# Capitaine Ad-Hoc

Pour illustrer rapidement la partie théorique, vous allez mettre en place un réseau ad-hoc avec un partenaire de votre choix.

## Exercice 0
[Lien vers les commandes](#Outils)

Utilisez `ifconfig` et `iwconfig` pour vous connecter à un réseau ad-hoc. Trouvez vos propres adresses MAC et IP. Vous pouvez maintenant utiliser les scripts `server.py` et `client.py` pour créer du traffic sur votre réseau ad-hoc.

---

# WPA et WPA2

La première partie de ce TP va consister à recupérer les clés de sécurité d'un des deux routeurs qui sont mis à disposition.

:::info
**WPA2 CCMP** (WiFi Protected Access Counter-Mode/CBC-Mac protocol), est la sécurité la plus utilisé pour les clés de sécurité des WAP (Wireless Access Point) aujourd'hui, elle remplace les sécurités WEP et WPA. CCMP n'utilise qu'une seule clé pour le chiffrement et l'intégrité. Le deuxième type d'algorithme utilisé est le WPA2 TKIP.
:::

L'algorithme utilisé est AES-CCM qui est lui-même est composé de deux algorithmes. AES-CTR, pour le chiffrement des données et AES-CBC pour la vérification de l'intégrité. La clé fait entre 128 et 256 bits.

## Exercice 1
[Lien vers les commandes](#Outils)

La première étape va être de passer sa carte réseau en mode Monitor afin de pouvoir écouter le trafic grâce à un sniffing de votre choix. Vous pouvez maintenant lancer l'outil bettercap.

:::info
**Attention**: Si bettercap vous demande des identifiants, ils se trouvent dans `/usr/local/share/bettercap/caplets/http-ui.cap`
:::

:::info
**Rappel** : Le mode promiscous et le mode Monitor sont deux modes différents. Le mode monitor est uniquement utilisé pour du réseau wireless. De plus en mode monitor nous n'avons pas besoin d'être appairé à un AP pour sniffer les paquets.
:::

Dans un second temps, vous allez avoir besoin de déconnecter un utilisateur du WAP cible afin de sniffer son handshake et de générer un fichier `.cap`.

La troisième et dernière étape consiste à effectuer une attaque dite 'bruteforce' par dictionnaire. Pour cela vous allez comparer les valeurs du fichier `.cap` et du dictionnaire qu'on vous a fourni.

Pour cet exercice, l'outil bettercap vous facilitera grandement la vie !

:::info
**Dictionnaire** :
Dans une attaque avec un contexte plus réaliste, il aurait fallu générer un dictionnaire adapté à votre cible ; c'est-à-dire qui s'approche le plus possible des probables *password* de la cible. Cette attaque reste très longue en éxécution.
:::

:::info
**Hacker Tip** :
Vous avez un dictionnaire déja présent sur kali du nom de rockyou dans le répertoire suivant : `/usr/share/wordlists/`
La commande gunzip vous sera utile pour extraire le dictionnaire
Ce dictionnaire ne vous aidera pas pour ce TP, utilisez plutôt la wordlist fournie par les assistants dans le git.
:::

:::success
**Bonus :** Si vous trouvez le mot de passe d'un des routeurs sans passer par la méthode de bruteforce décrite dans le sujet, un point bonus vous sera accordé. :star2: 
:::


---

# Rogue AP

Le deuxième exercice de ce TP va se tourner vers un deuxième type d'attaque. Vous allez simuler un point d'accès WiFi afin de potentiellement récuperer des informations sur la cible, cette méthode est celle de l'[*eviltwin*](https://fr.wikipedia.org/wiki/Jumeau_mal%C3%A9fique_(r%C3%A9seaux_sans_fil)).

## Exercice 2
[Lien vers les commandes](#Outils)

Comme pour le premier TP, commencez par vous assurer de passer votre carte réseau en mode monitor.

Vous pouvez ensuite tout simplement lancer votre rogue AP avec l'outil `hostapd` (Pensez à changer la config pour mettre le nom de votre interface WiFi). Ajoutez dans vos interfaces l'IP de l'eviltwin grâce à l'outil `ifconfig`.

:::info
**Hacker Tip :**
Ici, si votre cible est déjà authentifié sur l'AP original on peut effectuer une désauthentification et forcer notre rogue AP à emettre plus fort que l'AP original pour obliger la cible à se reconnecter sur le nôtre. Ceci est un scénario théorique, en réalité la priorité est donné de façon plus aléatoire.
:::

L'étape suivante va consister à configurer les tables de routage IP de votre rogue AP. Le but étant de forward correctement tous les paquets à leur destinataire pour rester le plus discret possible. Pour ce faire vous allez utiliser la commande `iptables` ainsi que ses différentes options.

:::spoiler
`$ iptables --flush`
`$ iptables --table nat --append POSTROUTING --out-interface 'out interface' -j MASQUERADE `
`$ iptables --append FORWARD --in-interface 'in interface' -j ACCEPT `
:::

Vous êtes prêt à activer l'IP forwarding, pour ce faire il suffit de l'activer :
```
$ echo 1 > /proc/sys/net/ipv4/ip_forward
```

Il faudra maintenant activer `dnsmasq` avec le fichier qu'on vous a fourni.

Félicitations, vous avez votre propre rogue AP !!!

---

# Injection sur couche applicative

Pour cette dernière partie vous allez avoir besoin d'un outil supplémentaire : bettercap. Pour l'obtenir il suffit de l'installer via le packet manager de votre OS.

## Exercice 3
[Lien vers les commandes](#Outils)

Commencez par lancer bettercap en mode debug sur votre rogue AP. Par la suite vous n'avez qu'à lancer l'interface web grâce à la commande:
```bash
$ api.rest on
```

Maintenant que vous avez accès à l'interface vous pouvez choisir quel module vous allez faire tourner entre un serveur http pour rediriger tout le traffic http sur notre serveur (une entrée iptables sera nécessaire) ou un proxy pour votre injection js.

Petite indication suppplémentaire: un répertoire existe déjà pour les serveurs web `/usr/share/bettercap/caplets/www/`.

---

# Bonus: Config WPA-Supplicant

Cet exercice s'adresse aux personnes souhaitant avoir une configuration WiFi sur un OS unix sans passer par un service type Network-Manager.

Nous allons utiliser `WPA-Supplicant` ; le deuxième outil que vous pouvez utiliser pour ce genre de configuration est `iwd`.

Commencez par créer un fichier `wpa_supplicant.conf` dans `/etc/wpa_supplicant/`.
Repérer votre interface WiFi, en général elle commence par 'w' (i.e. `wlan0`).

Pour aller plus loin vous pouvez suivre les indications de [ce blog](https://shapeshed.com/linux-wifi/?fbclid=IwAR2v-rMvfW3OJU8PBBdKjeH8p5aetdZar5H-jw_IfrFiMCch1cNYQ9Zx_eM) et en parler à vos assistants.


---

# Outils

`$ bettercap -iface [interface]` lancer bettercap

`$ ip a` montre tous les interfaces réseau disponibles

`$ ifconfig [interface] [options]` configure l'interface specifiée. Permet également d'ajouter une adresse IP à une interface.

`$ iwconfig [interface]` configure l'interface sans-fil specifiée.

`$ airmon-ng [option] [interface]`
change le mode de votre carte réseau de l'interface specifiée.

`$ aircrack-ng [.cap] -w [chemin absolue vers le dico]` permet d'activer le bruteforce avec le dictionnaire specifié sur le .cap specifié.

`$ hostapd` lance un wireless access point host par votre machine.

`$ dnsmasq -C [.conf] -d` active dnsmasq avec les infos fournies dans le .conf.