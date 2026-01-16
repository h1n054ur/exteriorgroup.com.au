/**
 * Exterior Group - Edge-native Hono Application
 * 
 * Main entry point for the Cloudflare Workers application.
 * Uses Hono JSX for server-side rendering and HTMX for interactivity.
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { eq } from 'drizzle-orm';
import { marked } from 'marked';
import type { Env } from './types/bindings';
import { createR2Response, createNotFoundResponse } from './lib/r2';
import { createDb } from './lib/db';
import { projects, leads } from '../db/schema';
import { Layout } from './components/ui/layout';
import { performanceHeaders, cacheHtml, cacheFragments, PRELOAD_HINTS } from './lib/cache';
import { ProofGallery, GalleryItemsFragment } from './components/proof/proof-gallery';
import { ProjectDetail } from './components/proof/project-detail';
import { SlideOverContainer } from './components/ui/slide-over';
import { LeadForm, LeadFormSuccess, ValidationError, ValidationSuccess } from './components/forms/lead-form';
import { validateEmail, validatePhone, validateLeadForm, verifyTurnstile, type LeadFormData } from './lib/validation';
import { 
  requireAuth, 
  getCurrentUser, 
  verifyPassword, 
  hashPassword, 
  createToken, 
  setAuthCookie, 
  clearAuthCookie,
  isRateLimited,
  recordFailedAttempt,
  clearFailedAttempts
} from './lib/auth';
import { AdminShell } from './components/admin/admin-shell';
import { LoginPage } from './components/admin/login-form';
import { DashboardContent } from './components/admin/dashboard';
import { LeadsListContent, LeadDetailContent, LeadUpdateSuccess } from './components/admin/leads';
import { ProjectsListContent, ProjectFormContent, ProjectDeleted } from './components/admin/projects';
import { MediaContent, UploadSuccess, UploadError, FileDeleted } from './components/admin/media';
import { sql, count, desc } from 'drizzle-orm';

// Create typed Hono application
const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// MIDDLEWARE (Performance Optimized - NFR1, NFR2)
// =============================================================================

// Performance timing headers
app.use('*', performanceHeaders);

// Compression for text responses
app.use('*', compress());

// Request logging (dev mode)
app.use('*', logger());

// Security headers
app.use('*', secureHeaders());

// Cache HTML responses
app.use('*', cacheHtml);

// Add preload hints for fonts
app.use('*', async (c, next) => {
  await next();
  c.header('Link', PRELOAD_HINTS);
});

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

// Landing page
app.get('/', (c) => {
  return c.html(
    <Layout title="Exterior Group | Commercial & Residential Exterior Services">
      <HeroSection />
      <ServicePillars />
      <ProofPreview />
      <CTASection />
    </Layout>
  );
});

// Service pages
app.get('/commercial', (c) => {
  return c.html(
    <Layout title="Commercial Services | Exterior Group">
      <ServicePage 
        title="Commercial Services"
        description="Expert exterior solutions for commercial properties, strata buildings, and large-scale projects."
        sector="commercial"
      />
    </Layout>
  );
});

app.get('/residential', (c) => {
  return c.html(
    <Layout title="Residential Services | Exterior Group">
      <ServicePage 
        title="Residential Services"
        description="Quality roofing and painting services for homes across Australia."
        sector="residential"
      />
    </Layout>
  );
});

app.get('/roofing', (c) => {
  return c.html(
    <Layout title="Roofing Services | Exterior Group">
      <ServicePage 
        title="Roofing Services"
        description="Professional roof restoration, repairs, and new installations."
        category="roofing"
      />
    </Layout>
  );
});

app.get('/painting', (c) => {
  return c.html(
    <Layout title="Painting Services | Exterior Group">
      <ServicePage 
        title="Painting Services"
        description="Expert exterior and interior painting for all property types."
        category="painting"
      />
    </Layout>
  );
});

// Gallery page with D1 data
app.get('/gallery', async (c) => {
  const db = createDb(c.env.DB);
  const projectList = await db.select().from(projects).where(eq(projects.published, true));
  
  return c.html(
    <Layout title="Our Work | Exterior Group">
      <section style={{ padding: '4rem 0' }}>
        <div class="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Work</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Browse our portfolio of completed projects and see the transformation for yourself.
          </p>
          <ProofGallery projects={projectList} showFilters={true} />
        </div>
      </section>
      <SlideOverContainer />
    </Layout>
  );
});

// Enquiry page with lead capture form
app.get('/enquire', (c) => {
  const turnstileSiteKey = c.env.TURNSTILE_SITE_KEY;
  const service = c.req.query('service');
  const sector = c.req.query('sector');
  
  return c.html(
    <Layout title="Get a Quote | Exterior Group">
      <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
        <div class="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get a Free Quote</h1>
            <p style={{ color: '#6b7280' }}>
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
          </div>
          <LeadForm 
            turnstileSiteKey={turnstileSiteKey}
            prefilledService={service}
            prefilledSector={sector}
          />
        </div>
      </section>
    </Layout>
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
    return c.json({ error: 'Failed to fetch asset', path }, 500);
  }
});

// =============================================================================
// FRAGMENT ROUTES (HTMX endpoints)
// =============================================================================

// Gallery fragment with category filtering
app.get('/api/fragments/gallery', async (c) => {
  const category = c.req.query('category');
  const db = createDb(c.env.DB);
  
  let query = db.select().from(projects).where(eq(projects.published, true));
  
  if (category && category !== '') {
    // @ts-ignore - Drizzle typing issue with dynamic where
    query = db.select().from(projects)
      .where(eq(projects.published, true))
      .$dynamic();
  }
  
  const projectList = await query;
  
  // Filter in memory for now (small dataset)
  const filtered = category 
    ? projectList.filter(p => p.category === category)
    : projectList;
  
  return c.html(<GalleryItemsFragment projects={filtered} />);
});

// Project detail fragment
app.get('/api/fragments/project/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = createDb(c.env.DB);
  
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  
  if (!project) {
    return c.html(
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Project not found
      </div>
    );
  }
  
  // Render markdown description
  const renderedContent = project.description 
    ? await marked.parse(project.description) 
    : undefined;
  
  return c.html(<ProjectDetail project={project} renderedContent={renderedContent} />);
});

// Lead form fragment
app.get('/api/fragments/lead-form', (c) => {
  const turnstileSiteKey = c.env.TURNSTILE_SITE_KEY;
  return c.html(<LeadForm turnstileSiteKey={turnstileSiteKey} />);
});

// =============================================================================
// LEAD CAPTURE API (Epic 4)
// =============================================================================

// Field validation endpoint (HTMX)
app.post('/api/leads/validate', async (c) => {
  const formData = await c.req.formData();
  
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  
  // Validate email if present
  if (email !== null) {
    const result = validateEmail(email);
    if (!result.valid) {
      return c.html(<ValidationError message={result.message!} />);
    }
    return c.html(<ValidationSuccess />);
  }
  
  // Validate phone if present
  if (phone !== null) {
    const result = validatePhone(phone);
    if (!result.valid) {
      return c.html(<ValidationError message={result.message!} />);
    }
    return c.html(<ValidationSuccess />);
  }
  
  return c.html(<ValidationSuccess />);
});

// Lead submission endpoint
app.post('/api/leads/submit', async (c) => {
  const formData = await c.req.formData();
  
  const data: LeadFormData = {
    name: formData.get('name') as string || '',
    email: formData.get('email') as string || '',
    phone: formData.get('phone') as string || undefined,
    company: formData.get('company') as string || undefined,
    serviceType: formData.get('serviceType') as string || 'general',
    sector: formData.get('sector') as string || 'residential',
    message: formData.get('message') as string || undefined,
    utmSource: formData.get('utmSource') as string || undefined,
    utmMedium: formData.get('utmMedium') as string || undefined,
    utmCampaign: formData.get('utmCampaign') as string || undefined,
    landingPage: formData.get('landingPage') as string || undefined,
    turnstileToken: formData.get('cf-turnstile-response') as string || undefined,
  };
  
  // Validate form data
  const validation = validateLeadForm(data);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return c.html(
      <div style={{
        background: '#fef2f2',
        border: '1px solid #ef4444',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
          {firstError}
        </p>
      </div>
    );
  }
  
  // Verify Turnstile if configured
  const turnstileSecret = c.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && data.turnstileToken) {
    const clientIp = c.req.header('CF-Connecting-IP');
    const turnstileResult = await verifyTurnstile(data.turnstileToken, turnstileSecret, clientIp);
    
    if (!turnstileResult.success) {
      return c.html(
        <div style={{
          background: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
            Security verification failed. Please try again.
          </p>
        </div>
      );
    }
  }
  
  // Insert lead into D1
  const db = createDb(c.env.DB);
  
  try {
    await db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      serviceType: data.serviceType,
      sector: data.sector,
      message: data.message || null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      landingPage: data.landingPage || null,
      status: 'new',
    });
    
    return c.html(<LeadFormSuccess name={data.name.split(' ')[0]} />);
    
  } catch (error) {
    console.error('Lead submission error:', error);
    return c.html(
      <div style={{
        background: '#fef2f2',
        border: '1px solid #ef4444',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
          Something went wrong. Please try again or contact us directly.
        </p>
      </div>
    );
  }
});

// =============================================================================
// PAGE COMPONENTS
// =============================================================================

/** Hero Section - Landing page main banner */
const HeroSection = () => (
  <section style={{
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '6rem 0',
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center'
  }}>
    <div class="container">
      <div style={{ maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          lineHeight: 1.1,
          marginBottom: '1.5rem'
        }}>
          Transform Your Property with
          <span style={{ color: '#f59e0b', display: 'block' }}>Expert Exterior Services</span>
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#d1d5db', 
          marginBottom: '2rem',
          maxWidth: '600px'
        }}>
          Professional roofing, painting, and restoration services for commercial and residential 
          properties across Australia. See the proof in our work.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/enquire" class="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Get a Free Quote
          </a>
          <a href="/gallery" style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1rem 2rem',
            color: 'white',
            fontWeight: 600,
            textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '0.5rem',
            transition: 'all 0.2s'
          }}>
            View Our Work →
          </a>
        </div>
      </div>
    </div>
  </section>
);

/** Service Pillars - The 3 main service categories */
const ServicePillars = () => {
  const pillars = [
    {
      title: 'Roofing',
      description: 'Roof restoration, repairs, and new installations with quality materials.',
      icon: '🏠',
      href: '/roofing',
      color: '#ef4444'
    },
    {
      title: 'Painting',
      description: 'Expert exterior and interior painting for lasting protection and appeal.',
      icon: '🎨',
      href: '/painting',
      color: '#3b82f6'
    },
    {
      title: 'Strata',
      description: 'Comprehensive exterior solutions for strata and commercial buildings.',
      icon: '🏢',
      href: '/commercial',
      color: '#10b981'
    }
  ];

  return (
    <section style={{ padding: '5rem 0', background: '#f9fafb' }}>
      <div class="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Our Services</h2>
          <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            From residential homes to large commercial properties, we deliver quality results every time.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {pillars.map(pillar => (
            <a href={pillar.href} style={{
              display: 'block',
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '2px solid transparent'
            }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                width: '4rem',
                height: '4rem',
                background: `${pillar.color}15`,
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{pillar.title}</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{pillar.description}</p>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Learn more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

/** Proof Preview - Teaser for the gallery */
const ProofPreview = () => (
  <section style={{ padding: '5rem 0' }}>
    <div class="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>See the Proof</h2>
        <p style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          Don't just take our word for it. Browse our portfolio of completed projects 
          and see the transformation for yourself.
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {[1, 2, 3].map(i => (
          <div style={{
            aspectRatio: '4/3',
            background: '#e5e7eb',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            Project {i}
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/gallery" class="btn-primary">
          View All Projects
        </a>
      </div>
    </div>
  </section>
);

/** CTA Section - Final call to action */
const CTASection = () => (
  <section style={{
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    padding: '5rem 0'
  }}>
    <div class="container" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Ready to Transform Your Property?
      </h2>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
        Get a free, no-obligation quote today.
      </p>
      <a href="/enquire" style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1rem 2.5rem',
        background: 'white',
        color: '#d97706',
        fontWeight: 700,
        fontSize: '1.125rem',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        transition: 'transform 0.2s'
      }}>
        Get Your Free Quote
      </a>
    </div>
  </section>
);

/** Service Page Template */
const ServicePage = ({ title, description, sector, category }: { 
  title: string; 
  description: string; 
  sector?: string;
  category?: string;
}) => (
  <section style={{ padding: '4rem 0' }}>
    <div class="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ color: '#6b7280', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '700px' }}>
        {description}
      </p>
      
      <div style={{
        background: '#f9fafb',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What We Offer</h2>
        <ul style={{ color: '#4b5563', lineHeight: 2 }}>
          <li>✓ Free on-site assessment and quote</li>
          <li>✓ Quality materials and workmanship</li>
          <li>✓ Fully licensed and insured team</li>
          <li>✓ Competitive pricing</li>
          <li>✓ Satisfaction guaranteed</li>
        </ul>
      </div>
      
      <a href="/enquire" class="btn-primary">
        Request a Quote
      </a>
    </div>
  </section>
);

/** Gallery Placeholder */
const GalleryPlaceholder = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  }}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div style={{
        aspectRatio: '4/3',
        background: '#e5e7eb',
        borderRadius: '0.75rem',
        animation: 'pulse 2s infinite'
      }} />
    ))}
  </div>
);

/** Form Placeholder */
const FormPlaceholder = () => (
  <div style={{
    background: '#f9fafb',
    borderRadius: '1rem',
    padding: '2rem'
  }}>
    <p style={{ color: '#6b7280', textAlign: 'center' }}>
      Loading form...
    </p>
  </div>
);

// =============================================================================
// ADMIN ROUTES (Epic 5 - Protected by requireAuth middleware)
// =============================================================================

// Admin login page
app.get('/admin/login', async (c) => {
  // If already logged in, redirect to dashboard
  const user = await getCurrentUser(c);
  if (user) {
    return c.redirect('/admin');
  }
  
  return c.html(<LoginPage />);
});

// Admin login handler
app.post('/admin/login', async (c) => {
  const db = createDb(c.env.DB);
  const clientIp = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  
  // Check rate limiting
  const rateLimited = await isRateLimited(db, clientIp);
  if (rateLimited) {
    return c.html(<LoginPage locked={true} lockoutMinutes={15} />);
  }
  
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  // Validate input
  if (!username || !password) {
    return c.html(<LoginPage error="Please enter both username and password" />);
  }
  
  // Check credentials
  // Admin username is 'admin', password hash stored in env
  if (username !== 'admin') {
    await recordFailedAttempt(db, clientIp);
    return c.html(<LoginPage error="Invalid username or password" />);
  }
  
  const passwordHash = c.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error('ADMIN_PASSWORD_HASH not configured');
    return c.html(<LoginPage error="Authentication not configured. Please contact administrator." />);
  }
  
  const passwordValid = await verifyPassword(password, passwordHash);
  if (!passwordValid) {
    await recordFailedAttempt(db, clientIp);
    return c.html(<LoginPage error="Invalid username or password" />);
  }
  
  // Clear failed attempts on successful login
  await clearFailedAttempts(db, clientIp);
  
  // Create JWT and set cookie
  const jwtSecret = c.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET not configured');
    return c.html(<LoginPage error="Authentication not configured. Please contact administrator." />);
  }
  
  const token = await createToken({ sub: 'admin', role: 'administrator' }, jwtSecret);
  setAuthCookie(c, token);
  
  return c.redirect('/admin');
});

// Admin logout
app.get('/admin/logout', (c) => {
  clearAuthCookie(c);
  return c.redirect('/admin/login');
});

// Admin dashboard (protected)
app.get('/admin', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  
  // Fetch dashboard stats
  const [totalLeadsResult] = await db.select({ count: count() }).from(leads);
  const [newLeadsResult] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
  const [totalProjectsResult] = await db.select({ count: count() }).from(projects);
  const [publishedProjectsResult] = await db.select({ count: count() }).from(projects).where(eq(projects.published, true));
  
  const stats = {
    totalLeads: totalLeadsResult?.count || 0,
    newLeads: newLeadsResult?.count || 0,
    totalProjects: totalProjectsResult?.count || 0,
    publishedProjects: publishedProjectsResult?.count || 0,
  };
  
  // Fetch recent leads
  const recentLeads = await db.select()
    .from(leads)
    .orderBy(sql`${leads.createdAt} DESC`)
    .limit(5);
  
  // Fetch recent projects
  const recentProjects = await db.select()
    .from(projects)
    .orderBy(sql`${projects.createdAt} DESC`)
    .limit(5);
  
  return c.html(
    <AdminShell title="Dashboard" currentPath="/admin" user={user || undefined}>
      <DashboardContent 
        stats={stats}
        recentLeads={recentLeads}
        recentProjects={recentProjects}
      />
    </AdminShell>
  );
});

// =============================================================================
// ADMIN - LEADS MANAGEMENT (Epic 6, Story 6.1)
// =============================================================================

// Leads list
app.get('/admin/leads', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  const statusFilter = c.req.query('status');
  
  // Get counts for each status
  const [allCount] = await db.select({ count: count() }).from(leads);
  const [newCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
  const [contactedCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'contacted'));
  const [quotedCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'quoted'));
  const [wonCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'won'));
  const [lostCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'lost'));
  
  const counts = {
    all: allCount?.count || 0,
    new: newCount?.count || 0,
    contacted: contactedCount?.count || 0,
    quoted: quotedCount?.count || 0,
    won: wonCount?.count || 0,
    lost: lostCount?.count || 0,
  };
  
  // Get leads with optional status filter
  let leadsList;
  if (statusFilter) {
    leadsList = await db.select()
      .from(leads)
      .where(eq(leads.status, statusFilter))
      .orderBy(sql`${leads.createdAt} DESC`);
  } else {
    leadsList = await db.select()
      .from(leads)
      .orderBy(sql`${leads.createdAt} DESC`);
  }
  
  return c.html(
    <AdminShell title="Leads" currentPath="/admin/leads" user={user || undefined}>
      <LeadsListContent 
        leads={leadsList}
        statusFilter={statusFilter}
        totalCount={counts.all}
        counts={counts}
      />
    </AdminShell>
  );
});

// Lead detail
app.get('/admin/leads/:id', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  const id = parseInt(c.req.param('id'));
  
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  
  if (!lead) {
    return c.redirect('/admin/leads');
  }
  
  return c.html(
    <AdminShell title={`Lead: ${lead.name}`} currentPath="/admin/leads" user={user || undefined}>
      <div style={{ marginBottom: '1rem' }}>
        <a href="/admin/leads" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Leads
        </a>
      </div>
      <LeadDetailContent lead={lead} />
    </AdminShell>
  );
});

// Lead status update (HTMX)
app.post('/api/admin/leads/:id/status', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const id = parseInt(c.req.param('id'));
  const formData = await c.req.formData();
  
  const status = formData.get('status') as string;
  const internalNotes = formData.get('internalNotes') as string;
  
  await db.update(leads)
    .set({ 
      status, 
      internalNotes: internalNotes || null,
      updatedAt: sql`datetime('now')`
    })
    .where(eq(leads.id, id));
  
  const [updatedLead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  
  return c.html(<LeadUpdateSuccess lead={updatedLead} />);
});

// =============================================================================
// ADMIN - PROJECTS MANAGEMENT (Epic 6, Story 6.2)
// =============================================================================

// Projects list
app.get('/admin/projects', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  
  const projectsList = await db.select()
    .from(projects)
    .orderBy(sql`${projects.createdAt} DESC`);
  
  return c.html(
    <AdminShell title="Projects" currentPath="/admin/projects" user={user || undefined}>
      <ProjectsListContent projects={projectsList} totalCount={projectsList.length} />
    </AdminShell>
  );
});

// New project form
app.get('/admin/projects/new', requireAuth, async (c) => {
  const user = await getCurrentUser(c);
  
  return c.html(
    <AdminShell title="New Project" currentPath="/admin/projects" user={user || undefined}>
      <div style={{ marginBottom: '1rem' }}>
        <a href="/admin/projects" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Projects
        </a>
      </div>
      <ProjectFormContent />
    </AdminShell>
  );
});

// Create project
app.post('/admin/projects', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  const formData = await c.req.formData();
  
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const sector = formData.get('sector') as string;
  const clientName = formData.get('clientName') as string;
  const location = formData.get('location') as string;
  const completedAt = formData.get('completedAt') as string;
  const excerpt = formData.get('excerpt') as string;
  const description = formData.get('description') as string;
  const metaTitle = formData.get('metaTitle') as string;
  const metaDescription = formData.get('metaDescription') as string;
  const featuredImageAlt = formData.get('featuredImageAlt') as string;
  const published = formData.get('published') === 'true';
  
  // Handle file uploads
  const featuredImage = formData.get('featuredImage') as File | null;
  const beforeImage = formData.get('beforeImage') as File | null;
  const afterImage = formData.get('afterImage') as File | null;
  
  let featuredImageKey = null;
  let beforeImageKey = null;
  let afterImageKey = null;
  
  // Upload images to R2 if provided
  if (featuredImage && featuredImage.size > 0) {
    const key = `projects/${slug}/featured-${Date.now()}.${featuredImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, featuredImage.stream(), {
      httpMetadata: { contentType: featuredImage.type }
    });
    featuredImageKey = key;
  }
  
  if (beforeImage && beforeImage.size > 0) {
    const key = `projects/${slug}/before-${Date.now()}.${beforeImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, beforeImage.stream(), {
      httpMetadata: { contentType: beforeImage.type }
    });
    beforeImageKey = key;
  }
  
  if (afterImage && afterImage.size > 0) {
    const key = `projects/${slug}/after-${Date.now()}.${afterImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, afterImage.stream(), {
      httpMetadata: { contentType: afterImage.type }
    });
    afterImageKey = key;
  }
  
  try {
    await db.insert(projects).values({
      title,
      slug,
      category,
      sector,
      clientName: clientName || null,
      location: location || null,
      completedAt: completedAt || null,
      excerpt: excerpt || null,
      description,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      featuredImageKey,
      featuredImageAlt: featuredImageAlt || null,
      beforeImageKey,
      afterImageKey,
      published,
    });
    
    return c.redirect('/admin/projects');
  } catch (error) {
    console.error('Project creation error:', error);
    return c.html(
      <AdminShell title="New Project" currentPath="/admin/projects" user={user || undefined}>
        <ProjectFormContent error="Failed to create project. The slug may already be in use." />
      </AdminShell>
    );
  }
});

// Edit project form
app.get('/admin/projects/:id/edit', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  const id = parseInt(c.req.param('id'));
  
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  
  if (!project) {
    return c.redirect('/admin/projects');
  }
  
  return c.html(
    <AdminShell title={`Edit: ${project.title}`} currentPath="/admin/projects" user={user || undefined}>
      <div style={{ marginBottom: '1rem' }}>
        <a href="/admin/projects" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Back to Projects
        </a>
      </div>
      <ProjectFormContent project={project} isEdit={true} />
    </AdminShell>
  );
});

// Update project
app.post('/admin/projects/:id', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const user = await getCurrentUser(c);
  const id = parseInt(c.req.param('id'));
  const formData = await c.req.formData();
  
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const sector = formData.get('sector') as string;
  const clientName = formData.get('clientName') as string;
  const location = formData.get('location') as string;
  const completedAt = formData.get('completedAt') as string;
  const excerpt = formData.get('excerpt') as string;
  const description = formData.get('description') as string;
  const metaTitle = formData.get('metaTitle') as string;
  const metaDescription = formData.get('metaDescription') as string;
  const featuredImageAlt = formData.get('featuredImageAlt') as string;
  const published = formData.get('published') === 'true';
  
  // Handle file uploads
  const featuredImage = formData.get('featuredImage') as File | null;
  const beforeImage = formData.get('beforeImage') as File | null;
  const afterImage = formData.get('afterImage') as File | null;
  const existingFeaturedImage = formData.get('existingFeaturedImage') as string;
  const existingBeforeImage = formData.get('existingBeforeImage') as string;
  const existingAfterImage = formData.get('existingAfterImage') as string;
  
  let featuredImageKey = existingFeaturedImage || null;
  let beforeImageKey = existingBeforeImage || null;
  let afterImageKey = existingAfterImage || null;
  
  // Upload new images to R2 if provided
  if (featuredImage && featuredImage.size > 0) {
    const key = `projects/${slug}/featured-${Date.now()}.${featuredImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, featuredImage.stream(), {
      httpMetadata: { contentType: featuredImage.type }
    });
    featuredImageKey = key;
  }
  
  if (beforeImage && beforeImage.size > 0) {
    const key = `projects/${slug}/before-${Date.now()}.${beforeImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, beforeImage.stream(), {
      httpMetadata: { contentType: beforeImage.type }
    });
    beforeImageKey = key;
  }
  
  if (afterImage && afterImage.size > 0) {
    const key = `projects/${slug}/after-${Date.now()}.${afterImage.name.split('.').pop()}`;
    await c.env.R2_BUCKET.put(key, afterImage.stream(), {
      httpMetadata: { contentType: afterImage.type }
    });
    afterImageKey = key;
  }
  
  try {
    await db.update(projects)
      .set({
        title,
        slug,
        category,
        sector,
        clientName: clientName || null,
        location: location || null,
        completedAt: completedAt || null,
        excerpt: excerpt || null,
        description,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        featuredImageKey,
        featuredImageAlt: featuredImageAlt || null,
        beforeImageKey,
        afterImageKey,
        published,
        updatedAt: sql`datetime('now')`,
      })
      .where(eq(projects.id, id));
    
    return c.redirect('/admin/projects');
  } catch (error) {
    console.error('Project update error:', error);
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return c.html(
      <AdminShell title={`Edit: ${project?.title}`} currentPath="/admin/projects" user={user || undefined}>
        <ProjectFormContent project={project} isEdit={true} error="Failed to update project." />
      </AdminShell>
    );
  }
});

// Delete project (HTMX)
app.delete('/api/admin/projects/:id', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const id = parseInt(c.req.param('id'));
  
  await db.delete(projects).where(eq(projects.id, id));
  
  return c.html(<ProjectDeleted />);
});

// Publish project (HTMX)
app.post('/api/admin/projects/:id/publish', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const id = parseInt(c.req.param('id'));
  
  await db.update(projects)
    .set({ published: true, updatedAt: sql`datetime('now')` })
    .where(eq(projects.id, id));
  
  return c.redirect('/admin/projects');
});

// =============================================================================
// ADMIN - MEDIA MANAGEMENT (Epic 6, Story 6.3)
// =============================================================================

// Media library
app.get('/admin/media', requireAuth, async (c) => {
  const user = await getCurrentUser(c);
  const prefix = c.req.query('prefix');
  
  // List objects from R2
  const listResult = await c.env.R2_BUCKET.list({
    prefix: prefix || undefined,
    limit: 100,
  });
  
  const items = listResult.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString(),
    httpMetadata: obj.httpMetadata,
  }));
  
  return c.html(
    <AdminShell title="Media Library" currentPath="/admin/media" user={user || undefined}>
      <MediaContent items={items} prefix={prefix} />
    </AdminShell>
  );
});

// Upload files (HTMX)
app.post('/api/admin/media/upload', requireAuth, async (c) => {
  const formData = await c.req.formData();
  const prefix = formData.get('prefix') as string || 'uploads';
  const files = formData.getAll('files') as unknown as File[];
  
  if (!files || files.length === 0) {
    return c.html(<UploadError message="No files provided" />);
  }
  
  const uploadedFiles: { key: string; url: string }[] = [];
  
  for (const file of files) {
    if (file.size === 0) continue;
    
    const key = `${prefix}/${Date.now()}-${file.name}`;
    
    try {
      await c.env.R2_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });
      
      uploadedFiles.push({
        key,
        url: `/api/assets/${key}`
      });
    } catch (error) {
      console.error('Upload error:', error);
      return c.html(<UploadError message={`Failed to upload ${file.name}`} />);
    }
  }
  
  return c.html(<UploadSuccess files={uploadedFiles} />);
});

// Delete file (HTMX)
app.delete('/api/admin/media/:key{.+}', requireAuth, async (c) => {
  const key = c.req.param('key');
  
  try {
    await c.env.R2_BUCKET.delete(key);
    return c.html(<FileDeleted />);
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.notFound((c) => {
  return c.html(
    <Layout title="404 - Page Not Found | Exterior Group">
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div class="container">
          <h1 style={{ fontSize: '4rem', color: '#d1d5db', marginBottom: '1rem' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            The page you're looking for doesn't exist.
          </p>
          <a href="/" class="btn-primary">Return Home</a>
        </div>
      </section>
    </Layout>,
    404
  );
});

app.onError((err, c) => {
  console.error('Application error:', err);
  return c.html(
    <Layout title="Error | Exterior Group">
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div class="container">
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            We're working on fixing this. Please try again later.
          </p>
          <a href="/" class="btn-primary">Return Home</a>
        </div>
      </section>
    </Layout>,
    500
  );
});

export default app;
