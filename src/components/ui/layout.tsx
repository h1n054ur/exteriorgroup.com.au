/**
 * Base Layout Component
 * 
 * Provides the consistent site shell with:
 * - Montserrat headings + Inter UI typography
 * - Responsive navigation
 * - HTMX integration
 * - Tailwind CSS
 */

import type { FC, PropsWithChildren } from 'hono/jsx';

interface LayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

export const Layout: FC<LayoutProps> = ({ 
  children, 
  title = 'Exterior Group | Commercial & Residential Exterior Services',
  description = 'Professional roofing, painting, and strata services for commercial and residential properties across Australia.'
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <title>{title}</title>
        
        {/* Google Fonts - Montserrat (headings) + Inter (UI) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap" 
          rel="stylesheet" 
        />
        
        {/* HTMX v2 */}
        <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
        
        {/* Inline critical styles for TTFB optimization */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-sans: 'Inter', system-ui, sans-serif;
            --font-heading: 'Montserrat', system-ui, sans-serif;
            --color-amber-500: #f59e0b;
            --color-amber-600: #d97706;
            --color-exterior-dark: #1a1a2e;
            --color-exterior-primary: #16213e;
          }
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          html { scroll-behavior: smooth; }
          
          body {
            font-family: var(--font-sans);
            color: #111827;
            background: #fff;
            -webkit-font-smoothing: antialiased;
            line-height: 1.5;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 700;
          }
          
          /* Navigation styles */
          .nav-link {
            color: #374151;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: all 0.2s;
          }
          
          .nav-link:hover {
            color: var(--color-amber-600);
            background: #fef3c7;
          }
          
          /* Mobile menu */
          .mobile-menu { display: none; }
          .mobile-menu.open { display: block; }
          
          /* Button styles */
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            background: var(--color-amber-500);
            color: white;
            font-weight: 600;
            border-radius: 0.5rem;
            transition: background 0.2s;
            text-decoration: none;
          }
          
          .btn-primary:hover {
            background: var(--color-amber-600);
          }
          
          /* Container */
          .container {
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          @media (min-width: 640px) {
            .container { padding: 0 1.5rem; }
          }
          
          @media (min-width: 1024px) {
            .container { padding: 0 2rem; }
          }
          
          /* HTMX loading indicator */
          .htmx-request .htmx-indicator { opacity: 1; }
          .htmx-indicator { opacity: 0; transition: opacity 0.2s; }
        `}} />
      </head>
      <body>
        <Navigation />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
};

/**
 * Responsive Navigation Component
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
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      background: 'white',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <nav class="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '4rem'
      }}>
        {/* Logo */}
        <a href="/" style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.5rem', 
          fontWeight: 800,
          color: 'var(--color-exterior-dark)',
          textDecoration: 'none'
        }}>
          Exterior<span style={{ color: 'var(--color-amber-500)' }}>Group</span>
        </a>
        
        {/* Desktop Navigation */}
        <div style={{ display: 'none' }} class="desktop-nav">
          {navLinks.map(link => (
            <a href={link.href} class="nav-link">{link.label}</a>
          ))}
          <a href="/enquire" class="btn-primary" style={{ marginLeft: '1rem' }}>
            Get a Quote
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          type="button"
          class="mobile-menu-btn"
          aria-label="Toggle menu"
          onclick="document.getElementById('mobile-menu').classList.toggle('open')"
          style={{
            display: 'block',
            padding: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" class="mobile-menu" style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        background: 'white'
      }}>
        {navLinks.map(link => (
          <a 
            href={link.href} 
            style={{
              display: 'block',
              padding: '0.75rem 0',
              color: '#374151',
              fontWeight: 500,
              textDecoration: 'none',
              borderBottom: '1px solid #f3f4f6'
            }}
          >
            {link.label}
          </a>
        ))}
        <a href="/enquire" class="btn-primary" style={{ 
          display: 'block', 
          textAlign: 'center',
          marginTop: '1rem' 
        }}>
          Get a Quote
        </a>
      </div>
      
      {/* Script for responsive behavior */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const mq = window.matchMedia('(min-width: 768px)');
          const desktopNav = document.querySelector('.desktop-nav');
          const mobileBtn = document.querySelector('.mobile-menu-btn');
          
          function handleResize(e) {
            if (e.matches) {
              desktopNav.style.display = 'flex';
              desktopNav.style.alignItems = 'center';
              desktopNav.style.gap = '0.5rem';
              mobileBtn.style.display = 'none';
            } else {
              desktopNav.style.display = 'none';
              mobileBtn.style.display = 'block';
            }
          }
          
          mq.addEventListener('change', handleResize);
          handleResize(mq);
        })();
      `}} />
    </header>
  );
};

/**
 * Footer Component
 */
const Footer: FC = () => {
  return (
    <footer style={{
      background: 'var(--color-exterior-dark)',
      color: 'white',
      padding: '3rem 0'
    }}>
      <div class="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem',
              marginBottom: '1rem'
            }}>
              Exterior<span style={{ color: 'var(--color-amber-500)' }}>Group</span>
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Professional exterior services for commercial and residential properties across Australia.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="/roofing" style={{ color: 'inherit', textDecoration: 'none' }}>Roofing</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="/painting" style={{ color: 'inherit', textDecoration: 'none' }}>Painting</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="/commercial" style={{ color: 'inherit', textDecoration: 'none' }}>Commercial</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="/residential" style={{ color: 'inherit', textDecoration: 'none' }}>Residential</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Contact</h4>
            <ul style={{ listStyle: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Sydney, Australia</li>
              <li style={{ marginBottom: '0.5rem' }}>info@exteriorgroup.com.au</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #374151',
          marginTop: '2rem',
          paddingTop: '2rem',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '0.875rem'
        }}>
          © {new Date().getFullYear()} Exterior Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Layout;
