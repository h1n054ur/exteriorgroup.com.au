/**
 * Exterior Group - Edge-native Hono Application
 * 
 * Main entry point for the Cloudflare Workers application.
 * Routes are organized in functions/ directory.
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { eq } from 'drizzle-orm';
import type { Env } from '../functions/_shared/auth';
import { createDb } from '../functions/_shared/db';
import { projects, leads } from '../db/schema';

// Import route modules
import assetsRoutes from '../functions/api/assets';
import galleryFragments from '../functions/api/fragments/gallery';
import projectFragments from '../functions/api/fragments/project';
import leadsRoutes from '../functions/api/leads';
import adminRoutes from '../functions/admin';

// Import components
import { Layout } from './components/ui/layout';

// Create typed Hono application
const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// MIDDLEWARE
// =============================================================================

app.use('*', logger());
app.use('*', secureHeaders());

// =============================================================================
// STATIC ASSETS (CSS)
// =============================================================================

app.get('/styles.css', async (c) => {
  // In production, this would be served from the static assets
  // For now, return a redirect or inline the built CSS
  const cssPath = 'styles.css';
  const object = await c.env.R2_BUCKET.get(cssPath).catch(() => null);
  
  if (object) {
    return new Response(object.body, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
  
  // Fallback: return minimal inline CSS
  return new Response(`
    :root {
      --font-sans: 'Inter', system-ui, sans-serif;
      --font-heading: 'Montserrat', system-ui, sans-serif;
      --color-amber-500: #f59e0b;
      --color-amber-600: #d97706;
      --color-exterior-dark: #1a1a2e;
    }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: var(--font-sans); color: #111827; background: #fff; line-height: 1.5; }
    h1,h2,h3,h4,h5,h6 { font-family: var(--font-heading); font-weight: 700; }
    .container { max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
    .btn-primary { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; background: var(--color-amber-500); color: white; font-weight: 600; border-radius: 0.5rem; text-decoration: none; }
    .btn-primary:hover { background: var(--color-amber-600); }
    .font-heading { font-family: var(--font-heading); }
    .text-amber-500 { color: var(--color-amber-500); }
    .text-amber-600 { color: var(--color-amber-600); }
    .bg-exterior-dark { background: var(--color-exterior-dark); }
    .min-h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
    .grid { display: grid; }
    .hidden { display: none; }
    .sticky { position: sticky; }
    .top-0 { top: 0; }
    .z-50 { z-index: 50; }
    .h-16 { height: 4rem; }
    .w-6 { width: 1.5rem; }
    .h-6 { height: 1.5rem; }
    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-8 { margin-bottom: 2rem; }
    .ml-4 { margin-left: 1rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-8 { margin-top: 2rem; }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-3xl { font-size: 1.875rem; }
    .text-4xl { font-size: 2.25rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .font-extrabold { font-weight: 800; }
    .text-white { color: white; }
    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .bg-white { background: white; }
    .bg-gray-50 { background: #f9fafb; }
    .bg-gray-100 { background: #f3f4f6; }
    .border { border: 1px solid #e5e7eb; }
    .border-b { border-bottom: 1px solid #e5e7eb; }
    .border-t { border-top: 1px solid #e5e7eb; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-gray-700 { border-color: #374151; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .overflow-hidden { overflow: hidden; }
    .transition-colors { transition: color 0.2s, background-color 0.2s; }
    .transition-transform { transition: transform 0.3s; }
    .hover\\:text-amber-600:hover { color: var(--color-amber-600); }
    .hover\\:bg-amber-50:hover { background: #fffbeb; }
    .hover\\:bg-gray-50:hover { background: #f9fafb; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .hover\\:text-white:hover { color: white; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .leading-relaxed { line-height: 1.625; }
    .uppercase { text-transform: uppercase; }
    .capitalize { text-transform: capitalize; }
    .tracking-wide { letter-spacing: 0.025em; }
    .no-underline { text-decoration: none; }
    .aspect-video { aspect-ratio: 16/9; }
    .aspect-\\[4\\/3\\] { aspect-ratio: 4/3; }
    .object-cover { object-fit: cover; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .max-w-none { max-width: none; }
    .col-span-full { grid-column: 1 / -1; }
    .text-center { text-align: center; }
    @media (min-width: 640px) {
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    }
    @media (min-width: 768px) {
      .md\\:hidden { display: none; }
      .md\\:flex { display: flex; }
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }
  `, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

// =============================================================================
// API ROUTES
// =============================================================================

app.route('/api/assets', assetsRoutes);
app.route('/api/fragments/gallery', galleryFragments);
app.route('/api/fragments/project', projectFragments);
app.route('/api/leads', leadsRoutes);
app.route('/admin', adminRoutes);

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    runtime: 'cloudflare-workers',
  });
});

// =============================================================================
// PUBLIC PAGES
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

// Gallery page
app.get('/gallery', async (c) => {
  const db = createDb(c.env.DB);
  const projectList = await db.select()
    .from(projects)
    .where(eq(projects.published, true));
  
  return c.html(
    <Layout title="Our Work | Exterior Group">
      <section class="py-16">
        <div class="container">
          <h1 class="font-heading text-4xl font-bold mb-4">Our Work</h1>
          <p class="text-gray-600 mb-8 max-w-2xl">
            Browse our portfolio of completed projects and see the transformation for yourself.
          </p>
          
          {/* Category Filters */}
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              class="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium"
              hx-get="/api/fragments/gallery"
              hx-target="#gallery-grid"
            >
              All
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
              hx-get="/api/fragments/gallery?category=roofing"
              hx-target="#gallery-grid"
            >
              Roofing
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
              hx-get="/api/fragments/gallery?category=painting"
              hx-target="#gallery-grid"
            >
              Painting
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
              hx-get="/api/fragments/gallery?category=strata"
              hx-target="#gallery-grid"
            >
              Strata
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div 
            id="gallery-grid" 
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectList.map(project => (
              <GalleryCard project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Slide-over Container */}
      <SlideOver />
    </Layout>
  );
});

// Enquiry page
app.get('/enquire', (c) => {
  const service = c.req.query('service');
  const sector = c.req.query('sector');
  const turnstileSiteKey = c.env.TURNSTILE_SITE_KEY;
  
  return c.html(
    <Layout title="Get a Quote | Exterior Group">
      <section class="py-16 bg-gray-50">
        <div class="container max-w-xl">
          <div class="text-center mb-8">
            <h1 class="font-heading text-4xl font-bold mb-4">Get a Free Quote</h1>
            <p class="text-gray-600">
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

// Service pages
app.get('/commercial', (c) => c.html(
  <Layout title="Commercial Services | Exterior Group">
    <ServicePage 
      title="Commercial Services"
      description="Expert exterior solutions for commercial properties, strata buildings, and large-scale projects."
    />
  </Layout>
));

app.get('/residential', (c) => c.html(
  <Layout title="Residential Services | Exterior Group">
    <ServicePage 
      title="Residential Services"
      description="Quality roofing and painting services for homes across Australia."
    />
  </Layout>
));

app.get('/roofing', (c) => c.html(
  <Layout title="Roofing Services | Exterior Group">
    <ServicePage 
      title="Roofing Services"
      description="Professional roof restoration, repairs, and new installations."
    />
  </Layout>
));

app.get('/painting', (c) => c.html(
  <Layout title="Painting Services | Exterior Group">
    <ServicePage 
      title="Painting Services"
      description="Expert exterior and interior painting for all property types."
    />
  </Layout>
));

// =============================================================================
// PAGE COMPONENTS
// =============================================================================

const HeroSection = () => (
  <section class="bg-gradient-to-br from-exterior-dark to-gray-900 text-white py-16 lg:py-24">
    <div class="container">
      <div class="max-w-3xl">
        <h1 class="font-heading text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
          Transform Your Property with
          <span class="text-amber-500 block">Expert Exterior Services</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl">
          Professional roofing, painting, and restoration services for commercial and residential 
          properties across Australia.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="/enquire" class="btn-primary text-lg px-8 py-4">
            Get a Free Quote
          </a>
          <a 
            href="/gallery" 
            class="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            View Our Work →
          </a>
        </div>
      </div>
    </div>
  </section>
);

const ServicePillars = () => {
  const pillars = [
    { title: 'Roofing', description: 'Roof restoration, repairs, and new installations.', icon: '🏠', href: '/roofing', color: 'red' },
    { title: 'Painting', description: 'Expert exterior and interior painting services.', icon: '🎨', href: '/painting', color: 'blue' },
    { title: 'Strata', description: 'Comprehensive solutions for strata buildings.', icon: '🏢', href: '/commercial', color: 'green' },
  ];

  return (
    <section class="py-16 bg-gray-50">
      <div class="container">
        <div class="text-center mb-12">
          <h2 class="font-heading text-3xl font-bold mb-4">Our Services</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            From residential homes to large commercial properties, we deliver quality results every time.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map(pillar => (
            <a 
              href={pillar.href}
              class="block bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div class="text-4xl mb-4">{pillar.icon}</div>
              <h3 class="font-heading text-xl font-bold mb-2">{pillar.title}</h3>
              <p class="text-gray-600 mb-4">{pillar.description}</p>
              <span class="text-amber-600 font-semibold">Learn more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProofPreview = () => (
  <section class="py-16">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="font-heading text-3xl font-bold mb-4">See the Proof</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Browse our portfolio of completed projects and see the transformation for yourself.
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div class="aspect-[4/3] bg-gray-100 rounded-xl"></div>
        ))}
      </div>
      
      <div class="text-center mt-8">
        <a href="/gallery" class="btn-primary">View All Projects</a>
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section class="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-16">
    <div class="container text-center">
      <h2 class="font-heading text-3xl font-bold mb-4">
        Ready to Transform Your Property?
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Get a free, no-obligation quote today.
      </p>
      <a 
        href="/enquire" 
        class="inline-flex items-center px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
      >
        Get Your Free Quote
      </a>
    </div>
  </section>
);

const ServicePage = ({ title, description }: { title: string; description: string }) => (
  <section class="py-16">
    <div class="container">
      <h1 class="font-heading text-4xl font-bold mb-4">{title}</h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl">{description}</p>
      
      <div class="bg-gray-50 rounded-xl p-8 mb-8">
        <h2 class="font-heading text-xl font-bold mb-4">What We Offer</h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span> Free on-site assessment and quote
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span> Quality materials and workmanship
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span> Fully licensed and insured team
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span> Competitive pricing
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span> Satisfaction guaranteed
          </li>
        </ul>
      </div>
      
      <a href="/enquire" class="btn-primary">Request a Quote</a>
    </div>
  </section>
);

const GalleryCard = ({ project }: { project: typeof projects.$inferSelect }) => (
  <article class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
    <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
      {project.featuredImageKey ? (
        <img 
          src={`/api/assets/${project.featuredImageKey}`}
          alt={project.featuredImageAlt || project.title}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      ) : (
        <div class="w-full h-full flex items-center justify-center text-gray-400">
          No image
        </div>
      )}
    </div>
    <div class="p-4">
      <span class="text-xs font-medium text-amber-600 uppercase">{project.category}</span>
      <h3 class="font-heading font-bold text-lg mt-1">{project.title}</h3>
      {project.location && (
        <p class="text-sm text-gray-500 mt-1">{project.location}</p>
      )}
    </div>
  </article>
);

const SlideOver = () => (
  <div id="slide-over" class="hidden fixed inset-0 z-50">
    <div 
      class="absolute inset-0 bg-black/50"
      onclick="document.getElementById('slide-over').classList.add('hidden')"
    ></div>
    <div class="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
      <button
        type="button"
        class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        onclick="document.getElementById('slide-over').classList.add('hidden')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div id="slide-over-content" class="h-full overflow-y-auto">
        {/* Content loaded via HTMX */}
      </div>
    </div>
  </div>
);

const LeadForm = ({ 
  turnstileSiteKey, 
  prefilledService, 
  prefilledSector 
}: { 
  turnstileSiteKey?: string;
  prefilledService?: string;
  prefilledSector?: string;
}) => (
  <form
    id="lead-form"
    hx-post="/api/leads/submit"
    hx-target="#lead-form"
    hx-swap="outerHTML"
    class="bg-white rounded-xl shadow-sm p-8"
  >
    <div class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="John Smith"
        />
      </div>
      
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="john@example.com"
          hx-post="/api/leads/validate"
          hx-trigger="blur"
          hx-target="next .validation-message"
          hx-swap="innerHTML"
        />
        <div class="validation-message"></div>
      </div>
      
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="0412 345 678"
          hx-post="/api/leads/validate"
          hx-trigger="blur"
          hx-target="next .validation-message"
          hx-swap="innerHTML"
        />
        <div class="validation-message"></div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            id="serviceType"
            name="serviceType"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="general" selected={!prefilledService}>General Inquiry</option>
            <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
            <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
            <option value="strata" selected={prefilledService === 'strata'}>Strata</option>
          </select>
        </div>
        
        <div>
          <label for="sector" class="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="sector"
            name="sector"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="residential" selected={prefilledSector !== 'commercial'}>Residential</option>
            <option value="commercial" selected={prefilledSector === 'commercial'}>Commercial</option>
          </select>
        </div>
      </div>
      
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Describe your project requirements..."
        ></textarea>
      </div>
      
      {turnstileSiteKey && (
        <div class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>
      )}
      
      <button type="submit" class="btn-primary w-full py-4 text-lg">
        Submit Inquiry
      </button>
    </div>
  </form>
);

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.notFound((c) => {
  return c.html(
    <Layout title="404 - Page Not Found | Exterior Group">
      <section class="py-16 text-center">
        <div class="container">
          <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 class="font-heading text-2xl font-bold mb-4">Page Not Found</h2>
          <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
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
      <section class="py-16 text-center">
        <div class="container">
          <h1 class="font-heading text-2xl font-bold mb-4">Something went wrong</h1>
          <p class="text-gray-600 mb-8">Please try again later.</p>
          <a href="/" class="btn-primary">Return Home</a>
        </div>
      </section>
    </Layout>,
    500
  );
});

export default app;
