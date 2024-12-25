import { useState } from "react";

// Hook do kopiowania tekstu do schowka
export default function useCopyToClipboard() {
  // Funkcja do kopiowania tekstu
  const copyToClipboard = async (element, callback) => {
    try {
      const html = element.current; // Zakładam, że `div` to ref przypisany do elementu, który chcesz skopiować

      // Używamy Clipboard API do skopiowania zawartości HTML
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html.innerHTML], {
            type: "text/html",
          }),
        }),
      ]);

      // Zmieniamy edytowalność tylko po pomyślnym skopiowaniu
      callback();
      // Ustawienie flagi, że kopiowanie się udało
    } catch (e) {
      console.log("Błąd kopiowania", e);
    }
  };

  return { copyToClipboard }; // Zwrócenie funkcji kopiowania i stanu
}
