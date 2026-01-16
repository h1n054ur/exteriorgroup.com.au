/**
 * Base Layout Component - Modern Redesign
 * 
 * Provides the consistent site shell with:
 * - Glassmorphism navigation
 * - Reveal on scroll logic
 * - Modern dark footer
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
  title = 'The Exterior Group | Premium Exterior Cleaning',
  description = 'Premium exterior cleaning for homes and businesses — windows, gutters, house washing, pressure washing, and more.',
  showEmergencyCTA = true
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#0b1220" />
        <title>{title}</title>
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* Tailwind CSS (built from src/styles.css) */}
        <link rel="stylesheet" href="/styles.css" />
        
        {/* HTMX v2 */}
        <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
      </head>
      <body id="top">
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
        <div class="toast" id="toast" role="status" aria-live="polite"></div>
        
        {/* Global Scripts */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Reveal on scroll
          const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
              if (en.isIntersecting) en.target.classList.add('in');
            });
          }, { threshold: 0.14 });
          document.querySelectorAll('.reveal').forEach(el => io.observe(el));

          // Nav scroll state
          const nav = document.querySelector('.nav');
          function onScroll(){
            if (window.scrollY > 8) nav.classList.add('is-scrolled');
            else nav.classList.remove('is-scrolled');
          }
          window.addEventListener('scroll', onScroll, { passive:true });
          onScroll();

          // Mobile menu
          const menuBtn = document.getElementById('menuBtn');
          const mobilePanel = document.getElementById('mobilePanel');
          menuBtn?.addEventListener('click', () => {
            const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!isOpen));
            mobilePanel.hidden = isOpen;
          });

          // Toast utility
          window.toast = function(msg){
            const el = document.getElementById('toast');
            el.textContent = msg;
            el.classList.add('show');
            window.clearTimeout(window._toastT);
            window._t = window.setTimeout(() => el.classList.remove('show'), 2600);
          }
        `}} />
      </body>
    </html>
  );
};

const Navigation: FC = () => {
  return (
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="/" aria-label="Home">
          <div class="logo flex items-center justify-center overflow-hidden bg-white p-1">
            <img src="/images/logos/logo-teg.png" alt="" class="w-full h-auto" />
          </div>
          <span>Exterior Group</span>
        </a>

        <nav class="nav-links hidden md:flex" aria-label="Primary">
          <a href="/#services">Services</a>
          <a href="/#why">Why us</a>
          <a href="/gallery">Our Work</a>
          <a href="/#reviews">Reviews</a>
          <a href="/enquire">Enquire</a>
        </nav>

        <div class="nav-cta flex items-center gap-2.5">
          <a class="phone hidden lg:inline-flex px-3 py-2.5 border border-white/10 bg-white/5 rounded-xl font-bold text-sm" href="tel:+61499999909">
            0499 999 909
          </a>
          <a class="btn primary text-sm py-2.5 px-4" href="/enquire">
            <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 8h10M7 12h6m-6 4h10" stroke-linecap="round"/>
              <path d="M5 3h14a2 2 0 0 1 2 2v14l-4-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke-linejoin="round" opacity=".9"/>
            </svg>
            Enquire
          </a>
          <button class="menu-btn flex md:hidden" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobilePanel">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 7h14M5 12h14M5 17h14" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="mobile-panel hidden bg-bg2/95 border-t border-line" id="mobilePanel" hidden>
        <div class="container py-4 space-y-2">
          <a href="/#services" class="block p-3 font-bold text-muted hover:text-text hover:bg-white/5 rounded-xl">Services</a>
          <a href="/#why" class="block p-3 font-bold text-muted hover:text-text hover:bg-white/5 rounded-xl">Why us</a>
          <a href="/gallery" class="block p-3 font-bold text-muted hover:text-text hover:bg-white/5 rounded-xl">Our Work</a>
          <a href="/#reviews" class="block p-3 font-bold text-muted hover:text-text hover:bg-white/5 rounded-xl">Reviews</a>
          <a href="/enquire" class="block p-3 font-bold text-muted hover:text-text hover:bg-white/5 rounded-xl text-accent">Enquire Now</a>
          <div class="pt-4">
            <a class="btn w-full justify-between" href="tel:+61499999909">
              <span>Call 0499 999 909</span>
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6.5 3.5h3l1.2 4-2 1.5c1.1 2.3 3 4.2 5.3 5.3l1.5-2 4 1.2v3c0 1-1 2-2.1 1.9C10.5 18.9 5.1 13.5 4.6 5.6 4.5 4.5 5.5 3.5 6.5 3.5Z" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="py-10 border-t border-line text-muted">
      <div class="container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="space-y-2">
            <a class="brand text-text" href="/">
              <div class="logo flex items-center justify-center overflow-hidden bg-white p-1">
                <img src="/images/logos/logo-teg.png" alt="" class="w-full h-auto" />
              </div>
              <span>Exterior Group</span>
            </a>
            <p class="text-xs text-muted2 max-w-md">
              Professional exterior services for commercial and residential properties. 
              Quality workmanship guaranteed since 2010.
            </p>
            <div class="text-xs">© {currentYear} All rights reserved.</div>
          </div>
          
          <div class="flex flex-wrap gap-x-8 gap-y-4 font-bold text-sm uppercase tracking-wider">
            <a href="/#services" class="hover:text-text transition-colors">Services</a>
            <a href="/gallery" class="hover:text-text transition-colors">Our Work</a>
            <a href="/#why" class="hover:text-text transition-colors">Why Choose Us</a>
            <a href="/enquire" class="hover:text-text transition-colors text-accent">Get a Quote</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Layout;
