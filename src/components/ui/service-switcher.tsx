import type { FC } from 'hono/jsx';

export const ServiceSwitcher: FC = () => {
  const residentialServices = [
    { 
      title: 'Window Cleaning', 
      tag: 'Streak-free finish',
      description: 'Detailed glass + frames + edges for a clean that looks sharp from the street and from inside.', 
      image: '/api/assets/services/residential-window-cleaning.png',
      badge: 'Tricky access ok',
      href: '/residential/window-cleaning'
    },
    { 
      title: 'Gutter Cleaning', 
      tag: 'Clear flow',
      description: 'Remove debris, reduce overflow risk, and leave things tidy. Ideal for seasonal maintenance.', 
      image: '/api/assets/services/residential-gutter-cleaning.png',
      badge: 'Inspection-friendly',
      href: '/residential/gutter-cleaning'
    },
    { 
      title: 'Soft House Washing', 
      tag: 'Low pressure',
      description: 'Safely lifts grime and organic build-up without blasting paint or cladding.', 
      image: '/api/assets/services/residential-house-washing.png',
      badge: 'Great for curb appeal',
      href: '/residential/house-washing'
    },
    { 
      title: 'Pressure Washing', 
      tag: 'Dialed-in power',
      description: 'Driveways, paths, decks and more — the right pressure for the surface, not a one-setting “blast”.', 
      image: '/api/assets/services/residential-pressure-washing.png',
      badge: 'Concrete / pavers / timber',
      href: '/residential/pressure-washing'
    }
  ];

  const commercialServices = [
    { 
      title: 'Commercial Windows', 
      tag: 'Professional finish',
      description: 'Clean glass, clean lines, stronger first impressions — for storefronts, offices, and sites.', 
      image: '/api/assets/services/commercial-window-cleaning.png',
      badge: 'After-hours options',
      href: '/commercial/window-cleaning'
    },
    { 
      title: 'Exterior Building Washing', 
      tag: 'Low-risk methods',
      description: 'Lift build-up across facades and cladding while protecting finishes and signage.', 
      image: '/api/assets/services/commercial-exterior-washing.png',
      badge: 'Maintenance plans',
      href: '/commercial/exterior-washing'
    },
    { 
      title: 'Commercial Pressure Washing', 
      tag: 'Footpaths & loading',
      description: 'Keep public areas, entries, and high-traffic zones safe, clean, and presentable.', 
      image: '/api/assets/services/commercial-pressure-washing.png',
      badge: 'Surface-appropriate',
      href: '/commercial/pressure-washing'
    },
    { 
      title: 'Site Washdowns', 
      tag: 'Fast turnaround',
      description: 'Pre-inspection cleans, turnover washes, and scheduled site care without the drama.', 
      image: '/api/assets/services/commercial-img.jpg',
      badge: 'Quote in minutes',
      href: '/commercial/site-washdowns'
    }
  ];

  return (
    <section id="services" class="py-20">
      <div class="container">
        <div class="section-head flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
          <div class="max-w-2xl">
            <div class="kicker mb-2">Services</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">What we clean</h2>
            <p class="text-muted leading-relaxed">Pick a category to see the most popular services. Built for speed: clear scope, safe methods, crisp results.</p>
          </div>

          <div class="tabs inline-flex p-1.5 bg-white/5 border border-white/10 rounded-2xl gap-1.5" role="tablist">
            <button 
              class="tab px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-white/10 text-white border border-white/15" 
              id="tabRes" 
              role="tab" 
              aria-selected="true"
              onclick="
                document.getElementById('panelRes').classList.remove('hidden');
                document.getElementById('panelCom').classList.add('hidden');
                this.classList.add('bg-white/10', 'text-white', 'border-white/15');
                document.getElementById('tabCom').classList.remove('bg-white/10', 'text-white', 'border-white/15');
              "
            >
              Residential
            </button>
            <button 
              class="tab px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-muted" 
              id="tabCom" 
              role="tab" 
              aria-selected="false"
              onclick="
                document.getElementById('panelRes').classList.add('hidden');
                document.getElementById('panelCom').classList.remove('hidden');
                this.classList.add('bg-white/10', 'text-white', 'border-white/15');
                document.getElementById('tabRes').classList.remove('bg-white/10', 'text-white', 'border-white/15');
              "
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Residential Panel */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 reveal" id="panelRes" role="tabpanel">
          {residentialServices.map(service => (
            <ServiceCard service={service} />
          ))}
        </div>

        {/* Commercial Panel */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 hidden reveal" id="panelCom" role="tabpanel">
          {commercialServices.map(service => (
            <ServiceCard service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service }: { service: any }) => (
  <article class="card service group overflow-hidden border border-white/15 bg-white/5 hover:border-white/25 transition-all">
    <div 
      class="media h-48 md:h-56 bg-cover bg-center border-b border-white/10 saturate-[1.05] contrast-[1.03] group-hover:scale-105 transition-transform duration-700"
      style={{ backgroundImage: `url('${service.image}')` }}
    ></div>
    <div class="body p-6">
      <div class="flex items-center justify-between gap-4 mb-3">
        <h3 class="text-xl font-extrabold tracking-tight">{service.title}</h3>
        <span class="px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted">{service.tag}</span>
      </div>
      <p class="text-muted text-sm leading-relaxed mb-6">{service.description}</p>
      <div class="flex items-center justify-between">
        <a class="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white hover:text-accent transition-colors" href={service.href}>
          Learn more
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17L17 7M9 7h8v8"/>
          </svg>
        </a>
        <span class="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-muted2 italic">{service.badge}</span>
      </div>
    </div>
  </article>
);
