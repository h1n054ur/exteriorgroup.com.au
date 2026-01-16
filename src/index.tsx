/**
 * Exterior Group - Edge-native Hono Application
 * 
 * Main entry point for the Cloudflare Workers application.
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { eq } from 'drizzle-orm';
import type { Env } from '../functions/_shared/auth';
import { createDb } from '../functions/_shared/db';
import { projects } from '../db/schema';

// Import route modules
import assetsRoutes from '../functions/api/assets';
import galleryFragments from '../functions/api/fragments/gallery';
import projectFragments from '../functions/api/fragments/project';
import leadsRoutes from '../functions/api/leads';
import adminRoutes from '../functions/admin';

// Import components
import { Layout } from './components/ui/layout';
import { HeroSection } from './components/ui/hero';
import { ServiceSwitcher } from './components/ui/service-switcher';
import { ToolkitSection } from './components/ui/toolkit-section';
import { ContentSection } from './components/ui/content-section';
import { ProofPreview } from './components/ui/proof-preview';
import { CTASection } from './components/ui/cta-section';
import { ServiceTemplate } from './components/ui/service-template';
import { LeadForm, LeadFormStandalone } from './components/forms/lead-form';
import { SlideOverContainer } from './components/ui/slide-over';
import { ProofCard } from './components/proof/proof-card';
import { WhyUs } from './components/ui/why-us';
import { Reviews } from './components/ui/reviews';
import { HowItWorks } from './components/ui/how-it-works';

// Create typed Hono application
const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// MIDDLEWARE
// =============================================================================

app.use('*', logger());
app.use('*', secureHeaders());

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
    <Layout title="Exterior Group | Make Your Home's Exterior Sparkle">
      <HeroSection />
      <ServiceSwitcher />
      <WhyUs />
      <ProofPreview />
      <ToolkitSection />
      <Reviews />
      <HowItWorks />
      <LeadForm />
    </Layout>
  );
});

// Service Page Data Helper
const commonBenefits = [
  { 
    title: '48hr Re-clean Guarantee', 
    description: 'If you\'re not 100% satisfied, we\'ll return within 48 hours to fix it.', 
    icon: (
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    title: 'Fully Insured & Bonded', 
    description: 'Complete peace of mind with our comprehensive insurance coverage.', 
    icon: (
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { 
    title: 'Eco-Friendly Cleaners', 
    description: 'We use biodegradable detergents that are safe for pets and plants.', 
    icon: (
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

// Residential Overview & Sub-pages
app.get('/residential', (c) => c.html(
  <ServiceTemplate 
    title="Residential Services"
    subtitle="Make your home's exterior sparkle with our professional cleaning solutions."
    heroImage="/api/assets/services/Residential-img.jpg"
    features={['Window Cleaning', 'Gutter Cleaning', 'House Washing', 'Pressure Washing']}
    benefits={commonBenefits}
  >
    <p>
      At Exterior Group, we understand that your home is your most valuable asset. 
      Our residential services are designed to enhance your property's curb appeal 
      while protecting its structural integrity.
    </p>
    <p>
      Whether you need crystal-clear windows, cleared gutters, or a full house wash, 
      our experienced team uses the latest technology and eco-friendly products 
      to deliver exceptional results every time.
    </p>
  </ServiceTemplate>
));

app.get('/residential/window-cleaning', (c) => c.html(
  <ServiceTemplate 
    title="Residential Window Cleaning"
    subtitle="Squeaky clean. Never streaky. High-quality scrubbers and squeegees for a perfect finish."
    heroImage="/api/assets/services/residential-window-cleaning.png"
    features={['Streak-free Guarantee', 'Frames & Sills Cleaned', 'Fly Screens Brushed', 'Hard Water Removal']}
    benefits={commonBenefits}
  >
    <p>Our professional window cleaning service goes beyond just the glass. We clean your frames, sills, and tracks to ensure your entire window assembly looks and functions like new.</p>
  </ServiceTemplate>
));

app.get('/residential/gutter-cleaning', (c) => c.html(
  <ServiceTemplate 
    title="Residential Gutter Cleaning"
    subtitle="Gutters so clean, you'll think they're new. Vacuum powered cleaning with camera inspection."
    heroImage="/api/assets/services/residential-gutter-cleaning.png"
    features={['Industrial Vacuums', 'Downpipe Flushing', 'Camera Inspections', 'Debris Removal']}
    benefits={commonBenefits}
  >
    <p>We use high-powered industrial vacuum systems to remove all debris from your gutters, ensuring proper water flow and preventing damage to your home's foundation and roof.</p>
  </ServiceTemplate>
));

// Commercial Overview & Sub-pages
app.get('/commercial', (c) => c.html(
  <ServiceTemplate 
    title="Commercial Services"
    subtitle="Industrial-grade exterior maintenance for businesses, strata, and complexes."
    heroImage="/api/assets/services/commercial-img.jpg"
    features={['Storefront Windows', 'High-Rise Cleaning', 'Building Washing', 'Concrete Sealing']}
    benefits={commonBenefits}
  >
    <p>
      Maintain a professional image and ensure the safety of your commercial property. 
      We provide reliable, efficient exterior cleaning services tailored to the 
      unique needs of businesses and strata managers.
    </p>
  </ServiceTemplate>
));

// Why Us / Results
app.get('/why-us', (c) => c.html(
  <Layout title="Why Us | Exterior Group">
    <WhyUs />
    <ProofPreview />
    <ToolkitSection />
    <Reviews />
    <LeadForm />
  </Layout>
));

// Enquiry page
app.get('/enquire', (c) => {
  const service = c.req.query('service');
  const sector = c.req.query('sector');
  const turnstileSiteKey = c.env.TURNSTILE_SITE_KEY;
  
  return c.html(
    <Layout title="Get a Quote | Exterior Group" showEmergencyCTA={false}>
      <section class="py-24">
        <div class="container max-w-2xl">
          <div class="text-center mb-12">
            <div class="kicker mb-3">Free estimate</div>
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Get a free quote</h1>
            <p class="text-muted text-lg leading-relaxed">
              Tell us about your project and we'll get back to you within 24 hours. 
              No obligation, completely free assessment.
            </p>
          </div>
          
          <LeadFormStandalone 
            turnstileSiteKey={turnstileSiteKey}
            prefilledService={service}
            prefilledSector={sector}
          />
        </div>
      </section>
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
      <section class="py-24">
        <div class="container">
          <div class="section-head mb-12">
            <div class="max-w-3xl">
              <div class="kicker mb-2">Portfolio</div>
              <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Our work</h1>
              <p class="text-muted leading-relaxed text-lg">
                Browse our portfolio of completed projects and see the transformation for yourself. 
                Each project represents our commitment to quality and craftsmanship.
              </p>
            </div>
          </div>
          
          {/* Category Filters */}
          <div class="flex flex-wrap gap-3 mb-12">
            <button
              class="btn py-2.5 px-5 text-sm active"
              hx-get="/api/fragments/gallery"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('primary')); this.classList.add('primary');"
            >
              All Projects
            </button>
            <button
              class="btn gallery-filter py-2.5 px-5 text-sm"
              hx-get="/api/fragments/gallery?category=residential"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('primary')); this.classList.add('primary');"
            >
              Residential
            </button>
            <button
              class="btn gallery-filter py-2.5 px-5 text-sm"
              hx-get="/api/fragments/gallery?category=commercial"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('primary')); this.classList.add('primary');"
            >
              Commercial
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div id="gallery-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.length > 0 ? (
              projectList.map(project => (
                <ProofCard project={project} />
              ))
            ) : (
              <div class="col-span-full text-center py-20 card border border-white/15 bg-white/5 rounded-2xl">
                <p class="text-muted font-bold">No projects found. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <SlideOverContainer />
    </Layout>
  );
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.notFound((c) => {
  return c.html(
    <Layout title="404 - Page Not Found | Exterior Group" showEmergencyCTA={false}>
      <section class="py-32 text-center">
        <div class="container max-w-xl">
          <div class="text-9xl font-extrabold text-white/10 mb-8 select-none">404</div>
          <h1 class="text-4xl font-extrabold mb-6">Page not found</h1>
          <p class="text-muted text-lg mb-10">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/" class="btn primary px-8 py-3.5">
              Return home
            </a>
            <a href="/enquire" class="btn px-8 py-3.5">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </Layout>,
    404
  );
});

app.onError((err, c) => {
  console.error('Application error:', err);
  return c.html(
    <Layout title="Error | Exterior Group" showEmergencyCTA={false}>
      <section class="py-32 text-center">
        <div class="container max-w-xl">
          <div class="w-24 h-24 mx-auto mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="text-4xl font-extrabold mb-6">Something went wrong</h1>
          <p class="text-muted text-lg mb-10">
            We're sorry, but something unexpected happened. Please try again later.
          </p>
          <a href="/" class="btn primary px-8 py-3.5">
            Return home
          </a>
        </div>
      </section>
    </Layout>,
    500
  );
});

export default app;
