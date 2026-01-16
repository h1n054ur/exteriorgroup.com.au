/**
 * Base Layout Component
 * 
 * Provides the consistent site shell with:
 * - Royal Blue nav-header (#003366)
 * - Montserrat headings + Inter UI typography
 * - Responsive navigation with nav-links
 * - Emergency sticky CTA for mobile
 * - Redesigned footer
 * - HTMX integration
 */

import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  showEmergencyCTA?: boolean;
}

export const Layout: FC<LayoutProps> = ({ 
  children, 
  title = 'Exterior Group | Commercial & Residential Exterior Services',
  description = 'Professional roofing, painting, and strata services for commercial and residential properties across Australia.',
  showEmergencyCTA = true
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <title>{title}</title>
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Tailwind CSS (built from src/styles.css) */}
        <link rel="stylesheet" href="/styles.css" />
        
        {/* HTMX v2 */}
        <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
      </head>
      <body class="min-h-screen flex flex-col">
        <Navigation />
        <main id="main-content" class="flex-1">
          {children}
        </main>
        <Footer />
        {showEmergencyCTA && <EmergencyStickyCTA />}
      </body>
    </html>
  );
};

/**
 * Royal Blue Navigation Header
 */
const Navigation: FC = () => {
  const navLinks = [
    { href: '/commercial', label: 'Commercial' },
    { href: '/residential', label: 'Residential' },
    { href: '/roofing', label: 'Roofing' },
    { href: '/painting', label: 'Painting' },
    { href: '/gallery', label: 'Our Work' },
  ];

  return (
    <header class="nav-header">
      <nav class="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" class="font-heading text-2xl font-extrabold text-white no-underline">
          Exterior<span class="text-amber">Group</span>
        </a>
        
        {/* Desktop Navigation */}
        <div class="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <a href={link.href} class="nav-link">
              {link.label}
            </a>
          ))}
          <a href="/enquire" class="btn-primary ml-4">
            Get a Quote
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          type="button"
          id="mobile-menu-btn"
          class="md:hidden p-2 text-white"
          aria-label="Toggle menu"
          aria-expanded="false"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" class="hidden md:hidden bg-brand border-t border-white/10">
        <div class="container py-4">
          {navLinks.map(link => (
            <a href={link.href} class="block py-3 px-4 text-white/85 font-medium rounded-md hover:bg-white/10">
              {link.label}
            </a>
          ))}
          <a href="/enquire" class="btn-primary w-full text-center mt-4">
            Get a Quote
          </a>
        </div>
      </div>
      
      {/* Mobile menu toggle script */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
          var menu = document.getElementById('mobile-menu');
          var expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
          menu.classList.toggle('hidden');
        });
      `}} />
    </header>
  );
};

/**
 * Emergency Sticky CTA for Mobile
 * Shows a prominent "Call Now" or "Get Quote" button fixed at bottom
 */
const EmergencyStickyCTA: FC = () => (
  <div class="emergency-sticky">
    <a href="/enquire" class="emergency-sticky-btn">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      Get Your Free Quote Now
    </a>
  </div>
);

/**
 * Redesigned Footer with footer classes
 */
const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          {/* Company Info */}
          <div>
            <div class="footer-brand">
              Exterior<span class="footer-brand-accent">Group</span>
            </div>
            <p class="footer-description">
              Professional exterior services for commercial and residential properties across Australia. 
              Trusted by homeowners and businesses since 2010.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h4 class="footer-title">Services</h4>
            <ul class="footer-links">
              <li><a href="/roofing" class="footer-link">Roofing</a></li>
              <li><a href="/painting" class="footer-link">Painting</a></li>
              <li><a href="/commercial" class="footer-link">Commercial</a></li>
              <li><a href="/residential" class="footer-link">Residential</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 class="footer-title">Company</h4>
            <ul class="footer-links">
              <li><a href="/gallery" class="footer-link">Our Work</a></li>
              <li><a href="/about" class="footer-link">About Us</a></li>
              <li><a href="/enquire" class="footer-link">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 class="footer-title">Contact Us</h4>
            <ul class="footer-links">
              <li class="footer-link">Sydney, NSW, Australia</li>
              <li>
                <a href="tel:1300123456" class="footer-link flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  1300 123 456
                </a>
              </li>
              <li>
                <a href="mailto:info@exteriorgroup.com.au" class="footer-link flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@exteriorgroup.com.au
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          © {currentYear} Exterior Group. All rights reserved. | ABN: 12 345 678 901
        </div>
      </div>
    </footer>
  );
};

export default Layout;
