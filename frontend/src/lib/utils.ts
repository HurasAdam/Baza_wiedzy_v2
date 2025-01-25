import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date, showTime: boolean = false) => {
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

  // Jeśli różnica przekracza 1 godzinę i showTime jest true, dodaj godzinę i minutę
  const month = dateObject.toLocaleString("pl-PL", { month: "short" });
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  // Jeśli przekroczono godzinę, dodaj godzinę i minutę, jeśli showTime jest true
  if (diffInHours >= 1 && showTime) {
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return `${day}-${month}-${year}`;
};
