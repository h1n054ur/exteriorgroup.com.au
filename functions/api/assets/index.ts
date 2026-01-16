/**
 * R2 Asset Proxy Route
 * 
 * Serves assets from R2 with proper caching headers.
 * Route: /api/assets/*
 */

import { Hono } from 'hono';
import { createR2Response, createNotFoundResponse } from '../../_shared/r2';
import type { Env } from '../../_shared/auth';

const app = new Hono<{ Bindings: Env }>();

// CORS preflight
app.options('/*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
      'Access-Control-Max-Age': '86400',
    },
  });
});

// Serve asset
app.on(['GET', 'HEAD'], '/*', async (c) => {
  const path = c.req.path.replace('/api/assets/', '');
  
  if (!path) {
    return c.json({ error: 'No asset path provided' }, 400);
  }
  
  try {
    const object = await c.env.R2_BUCKET.get(path);
    
    if (!object) {
      return createNotFoundResponse(path);
    }
    
    return createR2Response(object, path, c.req.raw);
  } catch (error) {
    console.error('R2 fetch error:', error);
    return c.json({ error: 'Failed to fetch asset' }, 500);
  }
});

export default app;
