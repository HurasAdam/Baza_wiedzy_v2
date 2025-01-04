export default function useCopyToClipboard() {
  const copyToClipboard = async (element, callback) => {
    try {
      const html = element.current;
      if (!html) {
        console.error("Nie znaleziono elementu do kopiowania.");
        return;
      }

      console.log("html.innerHTML:", html.innerHTML);

      const blob = new Blob([html.innerHTML], { type: "text/html" });

      const clipboardItem = new ClipboardItem({
        "text/html": blob,
        "text/plain": new Blob([html.textContent], { type: "text/plain" }),
      });

      await navigator.clipboard.write([clipboardItem]);

      callback(); // Sukces
    } catch (error) {
      console.error("Wystąpił błąd podczas kopiowania:", error);
    }
  };

  return { copyToClipboard };
}
