import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
  const dateObject = new Date(date);
  const now = new Date();

  // Obliczanie różnicy w milisekundach
  const diffInMs = now.getTime() - dateObject.getTime();

  // Różnica w minutach
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // Różnica w godzinach
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  // Różnica w dniach
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Jeśli różnica jest mniejsza niż 1 minuta (np. poniżej 60 sekund), wyświetlamy "Kilka sekund temu"
  if (diffInMs < 60000) {
    // 60000 ms = 1 minuta
    return "Kilka sekund temu";
  }

  // Jeśli różnica jest mniejsza niż 1 godzina, wyświetlamy w minutach
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min temu`;
  }

  // Jeśli różnica jest mniejsza niż 24 godziny, wyświetlamy w godzinach
  if (diffInHours < 24) {
    return `${diffInHours} godz. temu`;
  }

  // Jeśli różnica przekracza 24 godziny, wyświetlamy pełną datę
  const month = dateObject.toLocaleString("pl-PL", { month: "short" });
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  return `${day}-${month}-${year}`;
};
