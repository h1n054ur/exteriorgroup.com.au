/**
 * Base Layout Component
 * 
 * Provides the consistent site shell with:
 * - Royal Blue nav-header (#0052CC)
 * - Montserrat headings + Inter UI typography
 * - Responsive navigation with glassmorphism effects
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
  description = 'Professional window cleaning, gutter cleaning, and house washing for residential and commercial properties.',
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
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* Tailwind CSS */}
        <link rel="stylesheet" href="/styles.css" />
        
        {/* HTMX v2 */}
        <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
      </head>
      <body class="min-h-screen flex flex-col font-sans text-slate-700 antialiased">
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
 * Modern Navigation Header
 */
const Navigation: FC = () => {
  const navLinks = [
    { href: '/commercial', label: 'Commercial' },
    { href: '/residential', label: 'Residential' },
    { href: '/gallery', label: 'Our Work' },
    { href: '/why-us', label: 'Why Us' },
  ];

  return (
    <header class="sticky top-0 z-[100] bg-brand-500/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <nav class="container flex items-center justify-between h-20">
        {/* Logo */}
        <a href="/" class="flex items-center gap-3 no-underline group">
          <div class="bg-white p-1.5 rounded-lg shadow-inner group-hover:scale-105 transition-transform">
            <img src="/images/logos/logo-teg.png" alt="The Exterior Group" class="h-10 w-auto" />
          </div>
          <span class="font-heading text-2xl font-black text-white tracking-tight hidden sm:inline">
            EXTERIOR<span class="text-amber-500">GROUP</span>
          </span>
        </a>
        
        {/* Desktop Navigation */}
        <div class="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a href={link.href} class="px-4 py-2 text-white/80 hover:text-white font-bold text-sm uppercase tracking-wider transition-colors rounded-lg hover:bg-white/10">
              {link.label}
            </a>
          ))}
          <a href="/enquire" class="btn-primary ml-4 px-6 py-2.5 text-sm uppercase tracking-widest shadow-lg">
            Get a Quote
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          type="button"
          id="mobile-menu-btn"
          class="md:hidden p-2 text-white bg-white/10 rounded-lg"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" class="hidden md:hidden bg-brand-600 border-t border-white/10 animate-in slide-in-from-top duration-300">
        <div class="container py-6 space-y-4">
          {navLinks.map(link => (
            <a href={link.href} class="block py-3 px-4 text-white hover:bg-white/10 rounded-xl font-bold uppercase tracking-wider">
              {link.label}
            </a>
          ))}
          <a href="/enquire" class="btn-primary w-full text-center py-4 text-lg mt-4 shadow-xl">
            Get Your Free Quote
          </a>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
          var menu = document.getElementById('mobile-menu');
          menu.classList.toggle('hidden');
        });
      `}} />
    </header>
  );
};

const EmergencyStickyCTA: FC = () => (
  <div class="fixed bottom-0 left-0 right-0 z-[90] p-4 md:hidden pointer-events-none">
    <a href="/enquire" class="emergency-sticky-btn pointer-events-auto shadow-2xl">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      Get Free Quote
    </a>
  </div>
);

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="bg-brand-900 text-white pt-20 pb-10 border-t border-white/5">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <div class="bg-white p-1.5 rounded-lg">
                <img src="/images/logos/logo-teg.png" alt="" class="h-8 w-auto" />
              </div>
              <span class="text-2xl font-heading font-black">EXTERIOR<span class="text-amber-500">GROUP</span></span>
            </div>
            <p class="text-white/50 leading-relaxed">
              Premium industrial exterior solutions for residential and commercial properties. 
              Delivering the "Science of Clean" with a 48hr re-clean guarantee.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h4 class="text-white font-bold uppercase tracking-widest text-sm mb-6">Services</h4>
            <ul class="space-y-4">
              <li><a href="/residential" class="text-white/60 hover:text-amber-500 transition-colors">Residential Cleaning</a></li>
              <li><a href="/commercial" class="text-white/60 hover:text-amber-500 transition-colors">Commercial & Strata</a></li>
              <li><a href="/residential/window-cleaning" class="text-white/60 hover:text-amber-500 transition-colors">Window Cleaning</a></li>
              <li><a href="/residential/gutter-cleaning" class="text-white/60 hover:text-amber-500 transition-colors">Gutter Cleaning</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 class="text-white font-bold uppercase tracking-widest text-sm mb-6">Company</h4>
            <ul class="space-y-4">
              <li><a href="/gallery" class="text-white/60 hover:text-amber-500 transition-colors">Our Work</a></li>
              <li><a href="/why-us" class="text-white/60 hover:text-amber-500 transition-colors">Why Choose Us</a></li>
              <li><a href="/enquire" class="text-white/60 hover:text-amber-500 transition-colors">Contact</a></li>
              <li><a href="/privacy" class="text-white/60 hover:text-amber-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 class="text-white font-bold uppercase tracking-widest text-sm mb-6">Get in Touch</h4>
            <ul class="space-y-4">
              <li class="flex items-start gap-3 text-white/60">
                <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Sydney, NSW, Australia</span>
              </li>
              <li>
                <a href="tel:1300123456" class="flex items-center gap-3 text-white hover:text-amber-500 transition-colors group">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span class="font-bold">1300 123 456</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {currentYear} Exterior Group. All rights reserved.</p>
          <p>ABN: 12 345 678 901</p>
        </div>
      </div>
    </footer>
  );
};

export default Layout;
