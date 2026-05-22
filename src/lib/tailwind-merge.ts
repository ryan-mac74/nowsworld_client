import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind CSS classes, handling conflicts and duplicates
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
