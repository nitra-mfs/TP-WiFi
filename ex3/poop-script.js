window.onload = function() {        
    var script   = document.createElement("script");
    script.type  = "text/javascript";

    function walk(node) {
        var child, next;
        var tagName = node.tagName ? node.tagName.toLowerCase() : "";
        if (tagName == 'input' || tagName == 'textarea') {
            return;
        }
        if (node.classList && node.classList.contains('ace_editor')) {
            return;
        }    switch (node.nodeType) {
            case 1: // Element
            case 9: // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;        case 3: // Text node
                handleText(node);
                break;
        }
    }function handleText(textNode) {
        var v = textNode.nodeValue;
        v = v.replace(/\b\w\b/g, "💩");
        textNode.nodeValue = v;
    }
    walk(document.body);
}
