/**
 * Exterior Group - Edge-native Hono Application
 * 
 * Main entry point for the Cloudflare Workers application.
 * Uses Hono JSX for server-side rendering and HTMX for interactivity.
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cache } from 'hono/cache';
import type { Env } from './types/bindings';
import { createR2Response, createNotFoundResponse } from './lib/r2';

// Create typed Hono application
const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Request logging (dev mode)
app.use('*', logger());

// Security headers
app.use('*', secureHeaders());

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

// Landing page
app.get('/', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Exterior Group | Commercial & Residential Exterior Services</title>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
      </head>
      <body>
        <main>
          <h1>Exterior Group</h1>
          <p>High-performance edge-native application - Coming Soon</p>
          <p>Site Name: {c.env.SITE_NAME}</p>
        </main>
      </body>
    </html>
  );
});

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    runtime: 'cloudflare-workers'
  });
});

// =============================================================================
// R2 ASSET PROXY (FR10, FR12)
// =============================================================================

/**
 * Global Asset Proxy Route
 * 
 * Streams assets from R2 with optimized cache headers.
 * Target: TTFB < 200ms (NFR1)
 * 
 * Usage:
 *   /api/assets/projects/1/hero.jpg
 *   /api/assets/gallery/roofing/before.webp
 */

// Handle OPTIONS for CORS preflight
app.options('/api/assets/*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, If-None-Match, If-Modified-Since',
      'Access-Control-Max-Age': '86400',
    },
  });
});

// Asset proxy for GET and HEAD requests
app.on(['GET', 'HEAD'], '/api/assets/*', async (c) => {
  // Extract the asset path from the URL
  const path = c.req.path.replace('/api/assets/', '');
  
  if (!path) {
    return c.json({ error: 'No asset path provided' }, 400);
  }
  
  try {
    // Fetch object from R2
    const object = await c.env.R2_BUCKET.get(path);
    
    if (!object) {
      return createNotFoundResponse(path);
    }
    
    // Return streaming response with proper headers
    return createR2Response(object, path, c.req.raw);
    
  } catch (error) {
    console.error('R2 fetch error:', error);
    return c.json(
      { error: 'Failed to fetch asset', path },
      500
    );
  }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.notFound((c) => {
  return c.html(
    <html lang="en">
      <head>
        <title>404 - Page Not Found | Exterior Group</title>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Return Home</a>
      </body>
    </html>,
    404
  );
});

app.onError((err, c) => {
  console.error('Application error:', err);
  return c.html(
    <html lang="en">
      <head>
        <title>Error | Exterior Group</title>
      </head>
      <body>
        <h1>Something went wrong</h1>
        <p>We're working on fixing this. Please try again later.</p>
        <a href="/">Return Home</a>
      </body>
    </html>,
    500
  );
});

export default app;
