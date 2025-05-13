import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pothole calculations:
export const calculateArea = (l: number, w: number): number => l * w;
export const calculateVolume = (l: number, w: number, d: number): number =>
  l * w * d;
export const calculateMaterials = (bags: number): number => bags * 25; // 25kg per bag
