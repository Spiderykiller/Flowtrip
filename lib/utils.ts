import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Creates a Next.js-compatible page URL from a page name.
 */
export function createPageUrl(pageName: string): string {
  return '/' + pageName.toLowerCase().replace(/ /g, '-')
}

/**
 * Detect iframe safely in browser only.
 */
export const isIframe: boolean =
  typeof window !== 'undefined' && window.self !== window.top