import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanWorkspaceName(name?: string): string {
  if (!name) return "";
  return name.replace(/'s Workspace$/i, '').replace(/ Workspace$/i, '');
}
