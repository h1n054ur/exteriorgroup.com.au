/**
 * Lead Capture API Routes
 * 
 * Handles lead form validation and submission.
 */

import { Hono } from 'hono';
import { createDb } from '../../_shared/db';
import { leads } from '../../../db/schema';
import type { Env } from '../../_shared/auth';

const app = new Hono<{ Bindings: Env }>();

/**
 * Validate individual field (HTMX)
 * POST /api/leads/validate
 */
app.post('/validate', async (c) => {
  const formData = await c.req.formData();
  
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  
  if (email !== null) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return c.html(<ValidationError message="Email is required" />);
    }
    if (!emailRegex.test(email)) {
      return c.html(<ValidationError message="Please enter a valid email address" />);
    }
    return c.html(<ValidationSuccess />);
  }
  
  if (phone !== null) {
    const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?\d){8}$/;
    if (phone.trim() && !phoneRegex.test(phone.replace(/\s/g, ''))) {
      return c.html(<ValidationError message="Please enter a valid Australian phone number" />);
    }
    return c.html(<ValidationSuccess />);
  }
  
  return c.html(<ValidationSuccess />);
});

/**
 * Submit lead form
 * POST /api/leads/submit
 */
app.post('/submit', async (c) => {
  const formData = await c.req.formData();
  
  const name = formData.get('name') as string || '';
  const email = formData.get('email') as string || '';
  const phone = formData.get('phone') as string || '';
  const company = formData.get('company') as string || '';
  const serviceType = formData.get('serviceType') as string || 'general';
  const sector = formData.get('sector') as string || 'residential';
  const message = formData.get('message') as string || '';
  const utmSource = formData.get('utmSource') as string || '';
  const utmMedium = formData.get('utmMedium') as string || '';
  const utmCampaign = formData.get('utmCampaign') as string || '';
  const landingPage = formData.get('landingPage') as string || '';
  const turnstileToken = formData.get('cf-turnstile-response') as string || '';
  
  // Validate required fields
  if (!name.trim()) {
    return c.html(<FormError message="Name is required" />);
  }
  if (!email.trim()) {
    return c.html(<FormError message="Email is required" />);
  }
  
  // Verify Turnstile if configured
  const turnstileSecret = c.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileToken) {
    const clientIp = c.req.header('CF-Connecting-IP');
    const result = await verifyTurnstile(turnstileToken, turnstileSecret, clientIp);
    if (!result.success) {
      return c.html(<FormError message="Security verification failed. Please try again." />);
    }
  }
  
  // Insert lead into D1
  const db = createDb(c.env.DB);
  
  try {
    await db.insert(leads).values({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      company: company.trim() || null,
      serviceType,
      sector,
      message: message.trim() || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      landingPage: landingPage || null,
      status: 'new',
    });
    
    return c.html(<FormSuccess name={name.split(' ')[0]} />);
  } catch (error) {
    console.error('Lead submission error:', error);
    return c.html(<FormError message="Something went wrong. Please try again." />);
  }
});

/**
 * Verify Turnstile token
 */
async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string | null
): Promise<{ success: boolean }> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: ip,
    }),
  });
  return response.json();
}

/**
 * Validation Error Fragment
 */
const ValidationError = ({ message }: { message: string }) => (
  <p class="text-sm text-red-600 mt-1">{message}</p>
);

/**
 * Validation Success Fragment
 */
const ValidationSuccess = () => (
  <p class="text-sm text-green-600 mt-1">✓</p>
);

/**
 * Form Error Fragment
 */
const FormError = ({ message }: { message: string }) => (
  <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <p class="text-sm text-red-700">{message}</p>
  </div>
);

/**
 * Form Success Fragment
 */
const FormSuccess = ({ name }: { name: string }) => (
  <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
    <div class="text-4xl mb-4">✓</div>
    <h3 class="font-heading text-xl font-bold text-green-800 mb-2">
      Thank you, {name}!
    </h3>
    <p class="text-green-700">
      We've received your inquiry and will get back to you within 24 hours.
    </p>
  </div>
);

export default app;
