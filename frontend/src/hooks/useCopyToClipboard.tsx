export default function useCopyToClipboard() {
    const sanitizeHTML = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        doc.querySelectorAll("*").forEach((el) => {
            el.removeAttribute("style");
        });

        return doc.body.innerHTML;
    };

    const copyToClipboard = async (element, callback) => {
        try {
            const html = element.current;
            if (!html) {
                console.error("Nie znaleziono elementu do kopiowania.");
                return;
            }

            const rawHTML = html.innerHTML;
            const sanitizedHTML = sanitizeHTML(rawHTML);

            const tmpDiv = document.createElement("div");
            tmpDiv.innerHTML = sanitizedHTML;

            const walker = document.createTreeWalker(tmpDiv, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
            let plainText = "";
            const blockTags = new Set(["P", "DIV", "BR", "H1", "H2", "H3", "H4", "LI"]);

            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.nodeType === Node.TEXT_NODE) {
                    plainText += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (blockTags.has(node.tagName)) {
                        plainText += "\n";
                    }
                }
            }

            plainText = plainText.trim();

            const clipboardItem = new ClipboardItem({
                "text/html": new Blob([sanitizedHTML], { type: "text/html" }),
                "text/plain": new Blob([plainText], { type: "text/plain" }),
            });

            await navigator.clipboard.write([clipboardItem]);

            if (callback) callback();
        } catch (error) {
            console.error("Wystąpił błąd podczas kopiowania:", error);
        }
    };

    return { copyToClipboard };
}
