import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date, hours) => {
  // Get the month, day, and year
  const dateOjb = new Date(date);
  const month = dateOjb.toLocaleString("pl-PL", { month: "short" });
  const day = dateOjb.getDate();
  const year = dateOjb.getFullYear();
  const hour = dateOjb.getHours();
  const minutes = dateOjb.getMinutes();
  if (hours) {
    return `${day}-${month}-${year}, ${hour}:${
      minutes > 10 ? minutes : "0" + minutes
    }`;
  }
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};