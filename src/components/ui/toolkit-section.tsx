import type { FC } from 'hono/jsx';

export const ToolkitSection: FC = () => {
  const tools = [
    { 
      title: 'Window Toolkit', 
      description: 'Professional scrubbers and squeegees remove grit and grime without scratching delicate glass.', 
      image: '/api/assets/toolkit/toolkit-img-01.jpg',
      tag: 'PRECISION'
    },
    { 
      title: 'Gutter Vacuum', 
      description: 'High-power industrial vacuum system to remove even the most stubborn debris and sludge.', 
      image: '/api/assets/toolkit/toolkit-img-02.jpg',
      tag: 'POWER'
    },
    { 
      title: 'Soft Wash Tools', 
      description: 'Low-pressure delivery systems that apply specialized cleaners to kill moss and algae safely.', 
      image: '/api/assets/toolkit/toolkit-img-03.jpg',
      tag: 'SAFETY'
    },
    { 
      title: 'Pro Washers', 
      description: 'Commercial-grade pressure units with adjustable flow to handle everything from brick to timber.', 
      image: '/api/assets/toolkit/toolkit-img-04.jpg',
      tag: 'VERSATILITY'
    },
  ];

  return (
    <section class="py-24 bg-brand-900 text-white overflow-hidden relative">
      {/* Decorative Background Pattern */}
      <div class="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div class="container relative z-10">
        <div class="flex flex-col lg:flex-row gap-16 items-center">
          <div class="lg:w-1/3">
            <h2 class="text-4xl font-heading font-extrabold mb-6 leading-tight">
              The Science of <span class="text-amber-500">Clean</span>
            </h2>
            <p class="text-white/70 text-lg mb-8">
              We don't just "wash" your property. We use an engineered approach to exterior 
              maintenance, combining industrial-grade equipment with specialized techniques 
              for every surface.
            </p>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-white">OSHA Compliant</h4>
                  <p class="text-white/50 text-sm">Safety is our top priority for both our team and your property.</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-white">Eco-Friendly</h4>
                  <p class="text-white/50 text-sm">Our detergents are biodegradable and safe for your plants and pets.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tools.map(tool => (
              <div class="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500">
                <div class="aspect-video overflow-hidden">
                  <img src={tool.image} alt={tool.title} class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                  <div class="absolute top-4 left-4">
                    <span class="px-3 py-1 bg-amber-500 text-brand-900 text-[10px] font-black uppercase tracking-widest rounded">
                      {tool.tag}
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-heading font-bold text-white mb-2">{tool.title}</h3>
                  <p class="text-white/60 text-sm leading-relaxed">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
