export default function useCopyToClipboard() {
    // Funkcja do sanitizacji HTML
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

            const blob = new Blob([sanitizedHTML], { type: "text/html" });

            const clipboardItem = new ClipboardItem({
                "text/html": blob,
                "text/plain": new Blob([html.textContent], { type: "text/plain" }),
            });

            await navigator.clipboard.write([clipboardItem]);

            callback();
        } catch (error) {
            console.error("Wystąpił błąd podczas kopiowania:", error);
        }
    };

    return { copyToClipboard };
}
