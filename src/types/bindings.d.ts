/**
 * Cloudflare Workers Environment Bindings
 * 
 * This file defines the type-safe interface for all Cloudflare bindings
 * available in the Worker context (D1, R2, environment variables).
 */

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // R2 Object Storage binding
  R2_BUCKET: R2Bucket;
  
  // Environment variables
  SITE_NAME: string;
  
  // Secrets (set via wrangler secret put)
  JWT_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string;
}

// Extend Hono's context to include our bindings
declare module 'hono' {
  interface ContextVariableMap {
    // Custom context variables can be added here
  }
}
