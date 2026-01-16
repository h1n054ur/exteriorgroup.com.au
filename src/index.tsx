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
// STATIC ASSETS
// =============================================================================
// Note: CSS is served automatically from /dist directory via wrangler.toml [assets]
// The route below is no longer needed as Cloudflare Workers handles static assets

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

const ToolkitSection = () => {
  const tools = [
    { title: 'Window Toolkit', description: 'Professional scrubbers and squeegees remove grit and grime.', image: '/api/assets/toolkit/toolkit-01.jpeg' },
    { title: 'Gutter Vacuum', description: 'High-quality wet/dry vacuum to remove even the smallest debris.', image: '/api/assets/toolkit/toolkit-02.jpeg' },
    { title: 'Soft Wash Tools', description: 'Adjustable pressure to protect your building’s exterior siding.', image: '/api/assets/toolkit/toolkit-03.jpg' },
    { title: 'Pro Washers', description: 'Can be tuned to deliver the right amount of pressure for any surface.', image: '/api/assets/toolkit/toolkit-04.jpeg' },
  ];

  return (
    <section class="py-20">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Toolkit</h2>
          <p class="section-subtitle">
            How we tackle your toughest cleaning jobs. Our commitment to innovation 
            means your home will always be cleaned with the most effective tools.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map(tool => (
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-all">
              <div class="aspect-square overflow-hidden">
                <img src={tool.image} alt={tool.title} class="w-full h-full object-cover group-hover:scale-105 transition-all" />
              </div>
              <div class="p-4">
                <h3 class="font-heading font-bold text-brand">{tool.title}</h3>
                <p class="text-sm text-slate mt-2">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContentSection = () => (
  <section class="py-20 bg-slate-50">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="relative">
          <img src="/api/assets/content/main-content.jpeg" alt="Professional cleaning" class="rounded-2xl shadow-xl" />
          <div class="absolute -bottom-6 -right-6 bg-brand p-6 rounded-2xl shadow-lg hidden md:block">
            <p class="text-white font-bold text-xl">48hr Re-clean</p>
            <p class="text-white/80 text-sm">Satisfaction Guarantee</p>
          </div>
        </div>
        <div class="space-y-6">
          <h2 class="section-title" style="text-align: left;">Better tools for better results</h2>
          <p class="text-lg text-slate">
            When you turn to our team of cleaning professionals, you can count on a higher 
            level of clean. We don’t limit ourselves to tidying up at the ground level. 
            We use ladders and tools to get at those hard-to-reach spots.
          </p>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="bg-amber/10 p-3 rounded-lg h-fit text-amber">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-brand">Extreme close-up gutter cameras</h4>
                <p class="text-slate text-sm">We see clogs and deformities in detail for accurate quotes and quality checks.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="bg-amber/10 p-3 rounded-lg h-fit text-amber">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-brand">Professional grade pressure washers</h4>
                <p class="text-slate text-sm">Adjustable pressure to protect siding while blasting driveways clean.</p>
              </div>
            </div>
          </div>
          <div class="pt-4">
            <a href="/enquire" class="btn-primary">Schedule Your Appointment</a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Landing page
app.get('/', (c) => {
  return c.html(
    <Layout title="Exterior Group | Make Your Home's Exterior Sparkle">
      <HeroSection />
      <ServicePillars />
      <ContentSection />
      <ProofPreview />
      <ToolkitSection />
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
      <section class="py-20">
        <div class="container">
          <div class="section-header" style="text-align: left; margin: 0 0 2rem;">
            <h1 class="section-title">Our Work</h1>
            <p class="section-subtitle" style="max-width: 600px;">
              Browse our portfolio of completed projects and see the transformation for yourself. 
              Each project represents our commitment to quality and craftsmanship.
            </p>
          </div>
          
          {/* Category Filters */}
          <div class="filter-group">
            <button
              class="filter-btn active"
              hx-get="/api/fragments/gallery"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');"
            >
              All Projects
            </button>
            <button
              class="filter-btn"
              hx-get="/api/fragments/gallery?category=roofing"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');"
            >
              Roofing
            </button>
            <button
              class="filter-btn"
              hx-get="/api/fragments/gallery?category=painting"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');"
            >
              Painting
            </button>
            <button
              class="filter-btn"
              hx-get="/api/fragments/gallery?category=strata"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');"
            >
              Strata
            </button>
            <button
              class="filter-btn"
              hx-get="/api/fragments/gallery?category=commercial"
              hx-target="#gallery-grid"
              onclick="document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');"
            >
              Commercial
            </button>
          </div>
          
          {/* Gallery Grid */}
          <div id="gallery-grid" class="proof-grid">
            {projectList.length > 0 ? (
              projectList.map(project => (
                <GalleryCard project={project} />
              ))
            ) : (
              <div class="col-span-full text-center py-12">
                <svg class="w-16 h-16 mx-auto mb-4" style="color: var(--color-slate-300);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-slate">No projects found. Check back soon!</p>
              </div>
            )}
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
    <Layout title="Get a Quote | Exterior Group" showEmergencyCTA={false}>
      <section class="py-20 bg-slate-50">
        <div class="container max-w-xl">
          <div class="section-header mb-8">
            <h1 class="section-title">Get a Free Quote</h1>
            <p class="section-subtitle">
              Tell us about your project and we'll get back to you within 24 hours. 
              No obligation, completely free assessment.
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
  <section class="hero" style="background-image: linear-gradient(rgba(0,51,102,0.8), rgba(0,51,102,0.8)), url('/api/assets/corporate/corporate-mainstage.png'); background-size: cover; background-position: center;">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">
          Make your home’s exterior
          <span class="hero-title-accent">Sparkle</span>
        </h1>
        <p class="hero-subtitle">
          Trust the job to your tough-to-tackle cleaning team. Professional window cleaning, 
          gutter cleaning, and house washing for residential and commercial properties.
        </p>
        <div class="hero-ctas">
          <a href="/enquire" class="btn-primary">
            Enquire Now
          </a>
          <a href="/gallery" class="btn-secondary" style="color: white; border-color: rgba(255,255,255,0.4);">
            Our Results →
          </a>
        </div>
        
        {/* Trust Stats */}
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-value">100%</div>
            <div class="hero-stat-label">Satisfaction Promise</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-value">48hr</div>
            <div class="hero-stat-label">Re-clean Guarantee</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-value">PRO</div>
            <div class="hero-stat-label">Grade Equipment</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicePillars = () => {
  const pillars = [
    { 
      title: 'Window Cleaning', 
      description: 'Squeaky clean. Never streaky. Professional scrubbers and squeegees remove grit and grime in no time.', 
      icon: '🪟', 
      href: '/window-cleaning',
      image: '/api/assets/services/residential-window-cleaning.png'
    },
    { 
      title: 'Gutter Cleaning', 
      description: 'Gutters so clean, you\'ll think they\'re new. We use extreme close-up cameras and powerful vacuums.', 
      icon: '🏠', 
      href: '/gutter-cleaning',
      image: '/api/assets/services/residential-gutter-cleaning.png'
    },
    { 
      title: 'Pressure Washing', 
      description: 'We\'ll give caked on dirt and grime the heave-ho! Professional grade washers tuned for your surface.', 
      icon: '💦', 
      href: '/pressure-washing',
      image: '/api/assets/services/residential-pressure-washing.png'
    },
  ];

  return (
    <section class="pillars">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Services</h2>
          <p class="section-subtitle">
            From residential homes to large commercial properties, we deliver a higher level of clean. 
            We use the right tools to get at those hard-to-reach spots.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map(pillar => (
            <a href={pillar.href} class="pillar-card">
              <div class="pillar-image">
                <div class="pillar-image-overlay"></div>
                <div class="pillar-icon">{pillar.icon}</div>
                <img src={pillar.image} alt={pillar.title} class="w-full h-full object-cover" />
              </div>
              <div class="pillar-content">
                <h3 class="pillar-title">{pillar.title}</h3>
                <p class="pillar-description">{pillar.description}</p>
                <span class="pillar-link">
                  Learn more 
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

import { BeforeAfterSlider } from './components/proof/before-after-slider';

// ... existing code ...

const ProofPreview = () => {
  return (
    <section class="py-20 bg-slate-50">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">See the Difference</h2>
          <p class="section-subtitle">
            Results you can rely on. Our work is exterior cleaning, but our mission is 
            creating extraordinary experiences.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="font-heading text-xl font-bold text-center text-brand">Concrete Cleaning</h3>
            <BeforeAfterSlider 
              beforeImage="/api/assets/before-after/pw-before-1.jpg"
              afterImage="/api/assets/before-after/pw-after-1.jpg"
              beforeAlt="Dirty concrete patio"
              afterAlt="Clean pressure washed concrete"
            />
          </div>
          <div class="space-y-4">
            <h3 class="font-heading text-xl font-bold text-center text-brand">House Washing</h3>
            <BeforeAfterSlider 
              beforeImage="/api/assets/before-after/hw-before-1.jpg"
              afterImage="/api/assets/before-after/hw-after-1.jpg"
              beforeAlt="Dirty house exterior"
              afterAlt="Clean washed house exterior"
            />
          </div>
        </div>
        
        <div class="text-center mt-12">
          <a href="/gallery" class="btn-primary">
            See More Results
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Transform Your Property?</h2>
        <p class="cta-subtitle">
          Get a free, no-obligation quote today. Our team will assess your property 
          and provide a detailed proposal within 24 hours.
        </p>
        <a href="/enquire" class="cta-btn">
          Get Your Free Quote
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
);

const ServicePage = ({ title, description }: { title: string; description: string }) => (
  <section class="py-20">
    <div class="container">
      <div class="max-w-3xl">
        <h1 class="section-title mb-4">{title}</h1>
        <p class="section-subtitle mb-8" style="text-align: left;">{description}</p>
      </div>
      
      <div class="bg-slate-50 rounded-xl p-8 mb-8 max-w-2xl">
        <h2 class="font-heading text-xl font-bold mb-6 text-brand">What We Offer</h2>
        <ul class="space-y-4">
          {[
            'Free on-site assessment and quote',
            'Quality materials and workmanship',
            'Fully licensed and insured team',
            'Competitive pricing with no hidden fees',
            'Satisfaction guaranteed on every project',
            'Ongoing support and maintenance options'
          ].map(item => (
            <li class="flex items-center gap-3 text-slate">
              <svg class="w-5 h-5 flex-shrink-0" style="color: var(--color-success);" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div class="flex flex-wrap gap-4">
        <a href="/enquire" class="btn-primary">
          Request a Quote
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a href="/gallery" class="btn-secondary">
          View Our Work
        </a>
      </div>
    </div>
  </section>
);

const GalleryCard = ({ project }: { project: typeof projects.$inferSelect }) => (
  <article class="proof-card">
    <div class="proof-card-image">
      <span class="proof-card-tag">{project.category}</span>
      {project.featuredImageKey ? (
        <img 
          src={`/api/assets/${project.featuredImageKey}`}
          alt={project.featuredImageAlt || project.title}
          loading="lazy"
        />
      ) : (
        <div style="width:100%;height:100%;background:linear-gradient(135deg, var(--color-slate-200) 0%, var(--color-slate-300) 100%);display:flex;align-items:center;justify-content:center;">
          <svg class="w-12 h-12" style="color: var(--color-slate-400);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div class="proof-card-overlay">
        <button 
          class="proof-card-overlay-btn"
          hx-get={`/api/fragments/project/${project.id}`}
          hx-target="#slide-over-content"
          hx-swap="innerHTML"
          onclick="document.getElementById('slide-over').classList.remove('hidden'); document.getElementById('slide-over').classList.add('open');"
        >
          View Project Details
        </button>
      </div>
    </div>
    <div class="proof-card-content">
      <h3 class="proof-card-title">{project.title}</h3>
      {project.location && (
        <p class="proof-card-location">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {project.location}
        </p>
      )}
    </div>
  </article>
);

const SlideOver = () => (
  <div id="slide-over" class="slide-over">
    <div 
      class="slide-over-backdrop"
      onclick="document.getElementById('slide-over').classList.remove('open'); setTimeout(() => document.getElementById('slide-over').classList.add('hidden'), 300);"
    ></div>
    <div class="slide-over-panel">
      <button
        type="button"
        class="slide-over-close"
        onclick="document.getElementById('slide-over').classList.remove('open'); setTimeout(() => document.getElementById('slide-over').classList.add('hidden'), 300);"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div id="slide-over-content" class="h-full overflow-y-auto p-6 pt-16">
        {/* Content loaded via HTMX */}
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
            <div class="skeleton h-4 w-32 mx-auto"></div>
          </div>
        </div>
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
    class="lead-form"
  >
    {/* Name Field */}
    <div class="form-group">
      <input
        type="text"
        id="name"
        name="name"
        required
        class="form-input"
        placeholder=" "
      />
      <label for="name" class="form-label">Full Name *</label>
    </div>
    
    {/* Email Field */}
    <div class="form-group">
      <input
        type="email"
        id="email"
        name="email"
        required
        class="form-input"
        placeholder=" "
        hx-post="/api/leads/validate"
        hx-trigger="blur"
        hx-target="next .validation-message"
        hx-swap="innerHTML"
      />
      <label for="email" class="form-label">Email Address *</label>
      <div class="validation-message"></div>
    </div>
    
    {/* Phone Field */}
    <div class="form-group">
      <input
        type="tel"
        id="phone"
        name="phone"
        class="form-input"
        placeholder=" "
        hx-post="/api/leads/validate"
        hx-trigger="blur"
        hx-target="next .validation-message"
        hx-swap="innerHTML"
      />
      <label for="phone" class="form-label">Phone Number</label>
      <div class="validation-message"></div>
    </div>
    
    {/* Service & Property Type */}
    <div class="grid grid-cols-2 gap-4">
      <div class="form-group">
        <select
          id="serviceType"
          name="serviceType"
          class="form-input form-select"
        >
          <option value="general" selected={!prefilledService}>General Inquiry</option>
          <option value="roofing" selected={prefilledService === 'roofing'}>Roofing</option>
          <option value="painting" selected={prefilledService === 'painting'}>Painting</option>
          <option value="strata" selected={prefilledService === 'strata'}>Strata</option>
        </select>
        <label class="form-label" style="transform: translateY(-2.25rem) scale(0.85); color: var(--color-brand-500); background: white; padding: 0 0.5rem;">
          Service Type
        </label>
      </div>
      
      <div class="form-group">
        <select
          id="sector"
          name="sector"
          class="form-input form-select"
        >
          <option value="residential" selected={prefilledSector !== 'commercial'}>Residential</option>
          <option value="commercial" selected={prefilledSector === 'commercial'}>Commercial</option>
        </select>
        <label class="form-label" style="transform: translateY(-2.25rem) scale(0.85); color: var(--color-brand-500); background: white; padding: 0 0.5rem;">
          Property Type
        </label>
      </div>
    </div>
    
    {/* Message Field */}
    <div class="form-group">
      <textarea
        id="message"
        name="message"
        rows={4}
        class="form-input"
        placeholder=" "
      ></textarea>
      <label for="message" class="form-label">Tell us about your project</label>
    </div>
    
    {/* Turnstile CAPTCHA */}
    {turnstileSiteKey && (
      <div class="cf-turnstile mb-4" data-sitekey={turnstileSiteKey}></div>
    )}
    
    {/* Submit Button */}
    <button type="submit" class="btn-primary w-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Submit Inquiry
    </button>
    
    {/* Trust Indicators */}
    <div class="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate">
      <p class="flex items-center justify-center gap-2">
        <svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
        </svg>
        Your information is secure and will never be shared
      </p>
    </div>
  </form>
);

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.notFound((c) => {
  return c.html(
    <Layout title="404 - Page Not Found | Exterior Group" showEmergencyCTA={false}>
      <section class="py-20 text-center">
        <div class="container max-w-xl">
          <div class="text-9xl font-heading font-extrabold text-slate-200 mb-4">404</div>
          <h1 class="section-title mb-4">Page Not Found</h1>
          <p class="section-subtitle mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/" class="btn-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Home
            </a>
            <a href="/enquire" class="btn-secondary">
              Contact Us
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
      <section class="py-20 text-center">
        <div class="container max-w-xl">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <svg class="w-10 h-10" style="color: var(--color-error);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="section-title mb-4">Something Went Wrong</h1>
          <p class="section-subtitle mb-8">
            We're sorry, but something unexpected happened. Please try again later 
            or contact us if the problem persists.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a href="/" class="btn-primary">
              Return Home
            </a>
            <a href="/enquire" class="btn-secondary">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </Layout>,
    500
  );
});

export default app;
