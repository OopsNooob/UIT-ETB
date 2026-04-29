import { mockApi as api } from "@/lib/mockHooks";
import { clsx, type ClassValue } from "clsx"
// Mock Id - no longer needed
// import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "@/lib/mockHooks";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useStorageUrl(storageId: any | undefined) {
 return useQuery(api.storage.getUrl, storageId ? {storageId} : "skip");
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Format price to USD currency
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/**
 * Calculate available tickets
 */
export function calculateTicketAvailability(total: number, sold: number): number {
  return Math.max(0, total - sold)
}