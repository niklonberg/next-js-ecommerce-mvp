import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function waitTest(waitDuration: number) {
  return new Promise((resolve) => setTimeout(resolve, waitDuration));
}
