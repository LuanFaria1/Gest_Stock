import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) { // <-- A palavra 'export' aqui é crucial!
  return twMerge(clsx(inputs));
}