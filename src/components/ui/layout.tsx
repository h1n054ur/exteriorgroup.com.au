/**
 * Base Layout Component
 * 
 * Provides the consistent site shell with:
 * - Montserrat headings + Inter UI typography
 * - Responsive navigation
 * - HTMX integration
 * - Tailwind CSS (external stylesheet)
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
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav class="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" class="font-heading text-2xl font-extrabold text-exterior-dark no-underline">
          Exterior<span class="text-amber-500">Group</span>
        </a>
        
        {/* Desktop Navigation */}
        <div class="hidden md:flex items-center gap-2">
          {navLinks.map(link => (
            <a 
              href={link.href} 
              class="px-4 py-2 text-gray-700 font-medium rounded-md hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
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
          class="md:hidden p-2 text-gray-700"
          aria-label="Toggle menu"
          aria-expanded="false"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 bg-white">
        <div class="container py-4 space-y-1">
          {navLinks.map(link => (
            <a 
              href={link.href} 
              class="block py-3 px-4 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
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
 * Footer Component
 */
const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="bg-exterior-dark text-white py-12">
      <div class="container">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 class="font-heading text-xl font-bold mb-4">
              Exterior<span class="text-amber-500">Group</span>
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Professional exterior services for commercial and residential properties across Australia.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h4 class="font-semibold mb-4">Services</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="/roofing" class="hover:text-white transition-colors">Roofing</a></li>
              <li><a href="/painting" class="hover:text-white transition-colors">Painting</a></li>
              <li><a href="/commercial" class="hover:text-white transition-colors">Commercial</a></li>
              <li><a href="/residential" class="hover:text-white transition-colors">Residential</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="/gallery" class="hover:text-white transition-colors">Our Work</a></li>
              <li><a href="/about" class="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/enquire" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Sydney, Australia</li>
              <li>
                <a href="mailto:info@exteriorgroup.com.au" class="hover:text-white transition-colors">
                  info@exteriorgroup.com.au
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          © {currentYear} Exterior Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Layout;
