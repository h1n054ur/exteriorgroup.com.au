/**
 * R2 Asset Proxy Utilities
 * 
 * Helper functions for streaming R2 objects with proper cache headers
 * to meet the TTFB < 200ms target (NFR1).
 */

// MIME type mapping for common asset extensions
const MIME_TYPES: Record<string, string> = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  
  // Documents
  '.pdf': 'application/pdf',
  
  // Web assets
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  
  // Video
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

/**
 * Get MIME type from file extension
 */
export function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Build cache headers for R2 asset response
 * 
 * Cache strategy:
 * - Immutable assets (with hash in filename): 1 year cache
 * - Project images: 1 week cache with revalidation
 * - Default: 1 day cache
 */
export function buildCacheHeaders(
  object: R2Object,
  path: string
): Headers {
  const headers = new Headers();
  
  // Content type from R2 metadata or inferred from extension
  const contentType = object.httpMetadata?.contentType || getMimeType(path);
  headers.set('Content-Type', contentType);
  
  // ETag for conditional requests
  headers.set('ETag', `"${object.etag}"`);
  
  // Content length if available
  if (object.size) {
    headers.set('Content-Length', object.size.toString());
  }
  
  // Determine cache duration based on path/type
  let cacheControl: string;
  
  if (path.includes('/_next/') || path.match(/\.[a-f0-9]{8,}\./)) {
    // Hashed/immutable assets - cache for 1 year
    cacheControl = 'public, max-age=31536000, immutable';
  } else if (path.startsWith('projects/') || path.startsWith('gallery/')) {
    // Project images - 1 week with revalidation
    cacheControl = 'public, max-age=604800, stale-while-revalidate=86400';
  } else {
    // Default - 1 day cache
    cacheControl = 'public, max-age=86400, stale-while-revalidate=3600';
  }
  
  headers.set('Cache-Control', cacheControl);
  
  // Last modified if available
  if (object.uploaded) {
    headers.set('Last-Modified', object.uploaded.toUTCString());
  }
  
  // CORS headers for cross-origin image loading
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  
  return headers;
}

/**
 * Handle conditional request (If-None-Match, If-Modified-Since)
 * Returns true if we should return 304 Not Modified
 */
export function shouldReturn304(
  request: Request,
  object: R2Object
): boolean {
  // Check If-None-Match header
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch) {
    // Remove quotes and compare
    const clientEtag = ifNoneMatch.replace(/^"|"$/g, '').replace(/^W\//, '');
    if (clientEtag === object.etag) {
      return true;
    }
  }
  
  // Check If-Modified-Since header
  const ifModifiedSince = request.headers.get('If-Modified-Since');
  if (ifModifiedSince && object.uploaded) {
    const clientDate = new Date(ifModifiedSince);
    if (object.uploaded <= clientDate) {
      return true;
    }
  }
  
  return false;
}

/**
 * Create a streaming response from R2 object
 */
export function createR2Response(
  object: R2ObjectBody,
  path: string,
  request: Request
): Response {
  // Check for 304 Not Modified
  if (shouldReturn304(request, object)) {
    return new Response(null, {
      status: 304,
      headers: {
        'ETag': `"${object.etag}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }
  
  const headers = buildCacheHeaders(object, path);
  
  // Handle HEAD requests
  if (request.method === 'HEAD') {
    return new Response(null, { status: 200, headers });
  }
  
  // Stream the body directly for GET requests
  return new Response(object.body, { status: 200, headers });
}

/**
 * Create a 404 response for missing assets
 */
export function createNotFoundResponse(path: string): Response {
  return new Response(
    JSON.stringify({ error: 'Asset not found', path }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }
  );
}
