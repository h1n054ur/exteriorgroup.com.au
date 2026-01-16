/**
 * Shared R2 Utilities
 * 
 * Helper functions for R2 object storage operations.
 */

/**
 * Get content type from file extension
 */
export function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
  };
  return types[ext || ''] || 'application/octet-stream';
}

/**
 * Create R2 response with proper headers
 */
export function createR2Response(
  object: R2ObjectBody,
  path: string,
  request: Request
): Response {
  const headers = new Headers();
  
  // Content type
  headers.set('Content-Type', object.httpMetadata?.contentType || getContentType(path));
  
  // Cache headers (1 year for immutable assets)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // ETag for conditional requests
  headers.set('ETag', object.httpEtag);
  
  // CORS
  headers.set('Access-Control-Allow-Origin', '*');
  
  // Handle conditional requests
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }
  
  return new Response(object.body, { headers });
}

/**
 * Create 404 response for missing assets
 */
export function createNotFoundResponse(path: string): Response {
  return new Response(`Asset not found: ${path}`, {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
}
