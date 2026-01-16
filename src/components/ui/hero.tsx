import type { FC } from 'hono/jsx';

export const HeroSection: FC = () => (
  <section class="relative min-h-[85vh] flex items-center overflow-hidden">
    {/* Background Image with Overlay */}
    <div class="absolute inset-0 z-0">
      <img 
        src="/api/assets/corporate-mainstage.png" 
        alt="Exterior Group Hero" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-brand-900/90 to-brand-800/40"></div>
    </div>

    <div class="container relative z-10 py-20">
      <div class="max-w-3xl">
        {/* Glassmorphism Badge */}
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span class="text-white/90 text-sm font-semibold tracking-wide uppercase">Premium Industrial Cleaning</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
          Make your home's exterior
          <span class="text-amber-500 block">Sparkle</span>
        </h1>
        
        <p class="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
          Trust the job to your tough-to-tackle cleaning team. Professional window cleaning, 
          gutter cleaning, and house washing for residential and commercial properties.
        </p>

        <div class="flex flex-wrap gap-4 mb-12">
          <a href="/enquire" class="btn-primary text-lg px-8 py-4">
            Enquire Now
          </a>
          <a href="/why-us" class="btn-secondary !text-white !border-white/40 hover:!bg-white/10 px-8 py-4">
            Our Results →
          </a>
        </div>
        
        {/* Trust Stats with Glassmorphism */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10 border-t border-white/20">
          <div class="flex flex-col">
            <span class="text-4xl font-heading font-bold text-amber-500">100%</span>
            <span class="text-white/60 text-sm uppercase tracking-wider">Satisfaction Promise</span>
          </div>
          <div class="flex flex-col">
            <span class="text-4xl font-heading font-bold text-amber-500">48hr</span>
            <span class="text-white/60 text-sm uppercase tracking-wider">Re-clean Guarantee</span>
          </div>
          <div class="flex flex-col">
            <span class="text-4xl font-heading font-bold text-amber-500">PRO</span>
            <span class="text-white/60 text-sm uppercase tracking-wider">Grade Equipment</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Decorative Element */}
    <div class="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none"></div>
  </section>
);
