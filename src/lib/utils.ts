import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "TEMP" / "temp" -> "Temp": first letter upper, rest lower.
export function toSentenceCase(value: string) {
  const v = value.trim();
  return v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : "";
}
