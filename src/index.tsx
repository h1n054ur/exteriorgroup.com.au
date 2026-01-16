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
import { projects } from '../db/schema';
import { Layout } from './components/ui/layout';
import { performanceHeaders, cacheHtml, cacheFragments, PRELOAD_HINTS } from './lib/cache';
import { ProofGallery, GalleryItemsFragment } from './components/proof/proof-gallery';
import { ProjectDetail } from './components/proof/project-detail';
import { SlideOverContainer } from './components/ui/slide-over';
import { LeadForm, LeadFormSuccess, ValidationError, ValidationSuccess } from './components/forms/lead-form';
import { validateEmail, validatePhone, validateLeadForm, verifyTurnstile, type LeadFormData } from './lib/validation';
import { leads } from '../db/schema';

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
