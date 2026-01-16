/**
 * Cache Middleware and Utilities
 * 
 * Implements aggressive caching for optimal performance.
 * Target: TTFB < 200ms (NFR1), LCP < 1.2s (NFR2)
 */

import type { Context, Next } from 'hono';

/**
 * Cache Control Headers for different content types
 */
export const CACHE_HEADERS = {
  // Static assets (CSS, JS, fonts) - 1 year with immutable
  static: 'public, max-age=31536000, immutable',
  
  // Images - 1 week with revalidation
  images: 'public, max-age=604800, stale-while-revalidate=86400',
  
  // HTML pages - short cache with revalidation for dynamic content
  html: 'public, max-age=60, stale-while-revalidate=600',
  
  // API responses - no cache by default
  api: 'no-cache, no-store, must-revalidate',
  
  // Fragment responses (HTMX) - short cache
  fragments: 'public, max-age=30, stale-while-revalidate=60',
} as const;

/**
 * Add cache headers to response based on content type
 */
export function setCacheHeaders(
  c: Context, 
  type: keyof typeof CACHE_HEADERS
): void {
  c.header('Cache-Control', CACHE_HEADERS[type]);
}

/**
 * Middleware to add performance headers to all responses
 */
export async function performanceHeaders(c: Context, next: Next) {
  // Add timing header for debugging
  const start = Date.now();
  
  await next();
  
  // Server timing header
  const duration = Date.now() - start;
  c.header('Server-Timing', `total;dur=${duration}`);
  
  // Security and performance headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
}

/**
 * Middleware to cache HTML pages
 */
export async function cacheHtml(c: Context, next: Next) {
  await next();
  
  const contentType = c.res.headers.get('Content-Type') || '';
  if (contentType.includes('text/html')) {
    c.header('Cache-Control', CACHE_HEADERS.html);
  }
}

/**
 * Middleware to cache fragment responses
 */
export async function cacheFragments(c: Context, next: Next) {
  await next();
  c.header('Cache-Control', CACHE_HEADERS.fragments);
}

/**
 * Generate ETag for content
 */
export function generateETag(content: string): string {
  // Simple hash for ETag
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `"${hash.toString(16)}"`;
}

/**
 * Preload hints for critical resources
 */
export const PRELOAD_HINTS = [
  '<https://fonts.googleapis.com>; rel=preconnect',
  '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
].join(', ');
