/**
 * Shared Authentication Utilities
 * 
 * JWT-based authentication for admin access.
 */

import { SignJWT, jwtVerify } from 'jose';
import type { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createDb } from './db';
import { loginAttempts } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  JWT_SECRET?: string;
  ADMIN_PASSWORD_HASH?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  SITE_NAME: string;
}

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'admin_session';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Hash a password using Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Create a JWT token
 */
export async function createToken(
  payload: { sub: string; role: string },
  secret: string
): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secretKey);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<{ sub: string; role: string } | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { sub: string; role: string };
  } catch {
    return null;
  }
}

/**
 * Set auth cookie with JWT
 */
export function setAuthCookie(c: Context<{ Bindings: Env }>, token: string): void {
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(c: Context<{ Bindings: Env }>): void {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}

/**
 * Get current user from cookie
 */
export async function getCurrentUser(
  c: Context<{ Bindings: Env }>
): Promise<{ sub: string; role: string } | null> {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;
  
  const jwtSecret = c.env.JWT_SECRET;
  if (!jwtSecret) return null;
  
  return verifyToken(token, jwtSecret);
}

/**
 * Check if IP is rate limited
 */
export async function isRateLimited(
  db: ReturnType<typeof createDb>,
  ipAddress: string
): Promise<boolean> {
  const [record] = await db.select()
    .from(loginAttempts)
    .where(eq(loginAttempts.ipAddress, ipAddress))
    .limit(1);
  
  if (!record) return false;
  
  if (record.lockedUntil) {
    const lockoutTime = new Date(record.lockedUntil);
    if (lockoutTime > new Date()) {
      return true;
    }
  }
  
  return false;
}

/**
 * Record failed login attempt
 */
export async function recordFailedAttempt(
  db: ReturnType<typeof createDb>,
  ipAddress: string
): Promise<void> {
  const [existing] = await db.select()
    .from(loginAttempts)
    .where(eq(loginAttempts.ipAddress, ipAddress))
    .limit(1);
  
  if (existing) {
    const newAttempts = existing.attempts + 1;
    const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;
    
    await db.update(loginAttempts)
      .set({
        attempts: newAttempts,
        lastAttempt: sql`datetime('now')`,
        lockedUntil: shouldLock 
          ? sql`datetime('now', '+${LOCKOUT_DURATION_MINUTES} minutes')`
          : null,
      })
      .where(eq(loginAttempts.ipAddress, ipAddress));
  } else {
    await db.insert(loginAttempts).values({
      ipAddress,
      attempts: 1,
    });
  }
}

/**
 * Clear failed attempts after successful login
 */
export async function clearFailedAttempts(
  db: ReturnType<typeof createDb>,
  ipAddress: string
): Promise<void> {
  await db.delete(loginAttempts)
    .where(eq(loginAttempts.ipAddress, ipAddress));
}

/**
 * Auth middleware - protects admin routes
 */
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const user = await getCurrentUser(c);
  
  if (!user) {
    const accept = c.req.header('Accept') || '';
    if (accept.includes('text/html')) {
      return c.redirect('/admin/login');
    }
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  c.set('user', user);
  await next();
}
