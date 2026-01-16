import type { FC } from 'hono/jsx';

export const ServiceSwitcher: FC = () => {
  const residentialServices = [
    { 
      title: 'Window Cleaning', 
      description: 'Squeaky clean. Never streaky. Professional scrubbers and squeegees remove grit and grime.', 
      image: '/api/assets/services/residential-window-cleaning.png',
      href: '/residential/window-cleaning'
    },
    { 
      title: 'Gutter Cleaning', 
      description: 'Gutters so clean, you\'ll think they\'re new. We use extreme close-up cameras and powerful vacuums.', 
      image: '/api/assets/services/residential-gutter-cleaning.png',
      href: '/residential/gutter-cleaning'
    },
    { 
      title: 'House Washing', 
      description: 'We\'ll give caked on dirt and grime the heave-ho! Professional grade washers tuned for your surface.', 
      image: '/api/assets/services/residential-house-washing.png',
      href: '/residential/house-washing'
    },
    { 
      title: 'Pressure Washing', 
      description: 'Blast away years of buildup from driveways, patios, and walkways with our pro equipment.', 
      image: '/api/assets/services/residential-pressure-washing.png',
      href: '/residential/pressure-washing'
    }
  ];

  const commercialServices = [
    { 
      title: 'Commercial Windows', 
      description: 'First impressions matter. We keep your storefront or office building looking pristine.', 
      image: '/api/assets/services/commercial-window-cleaning.png',
      href: '/commercial/window-cleaning'
    },
    { 
      title: 'Exterior Washing', 
      description: 'Safe and effective soft washing for commercial buildings of all sizes.', 
      image: '/api/assets/services/commercial-exterior-washing.png',
      href: '/commercial/exterior-washing'
    },
    { 
      title: 'Pressure Washing', 
      description: 'Heavy-duty concrete cleaning for car parks, walkways, and loading docks.', 
      image: '/api/assets/services/commercial-pressure-washing.png',
      href: '/commercial/pressure-washing'
    }
  ];

  return (
    <section class="py-24 bg-slate-50" id="services">
      <div class="container">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-brand-900 mb-6">Our Services</h2>
          <p class="text-lg text-slate-600">
            From residential homes to large commercial properties, we deliver a higher level of clean. 
            We use the right tools to get at those hard-to-reach spots.
          </p>
        </div>

        {/* HTMX Powered Tabs */}
        <div class="flex flex-col items-center">
          <div class="inline-flex p-1 bg-slate-200 rounded-xl mb-12">
            <button 
              class="px-8 py-3 rounded-lg font-heading font-bold transition-all bg-white text-brand-500 shadow-sm"
              onclick="document.getElementById('residential-panel').classList.remove('hidden'); document.getElementById('commercial-panel').classList.add('hidden'); this.classList.add('bg-white', 'text-brand-500', 'shadow-sm'); this.nextElementSibling.classList.remove('bg-white', 'text-brand-500', 'shadow-sm');"
            >
              Residential
            </button>
            <button 
              class="px-8 py-3 rounded-lg font-heading font-bold transition-all text-slate-600"
              onclick="document.getElementById('residential-panel').classList.add('hidden'); document.getElementById('commercial-panel').classList.remove('hidden'); this.classList.add('bg-white', 'text-brand-500', 'shadow-sm'); this.previousElementSibling.classList.remove('bg-white', 'text-brand-500', 'shadow-sm');"
            >
              Commercial
            </button>
          </div>

          {/* Residential Panel */}
          <div id="residential-panel" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {residentialServices.map(service => (
              <a href={service.href} class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
                <div class="aspect-[4/3] overflow-hidden">
                  <img src={service.image} alt={service.title} class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-heading font-bold text-brand-900 mb-2">{service.title}</h3>
                  <p class="text-slate-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <span class="inline-flex items-center text-brand-500 font-bold text-sm group-hover:gap-2 transition-all">
                    View Service 
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Commercial Panel */}
          <div id="commercial-panel" class="w-full hidden grid grid-cols-1 md:grid-cols-3 gap-8">
            {commercialServices.map(service => (
              <a href={service.href} class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
                <div class="aspect-[4/3] overflow-hidden">
                  <img src={service.image} alt={service.title} class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-heading font-bold text-brand-900 mb-2">{service.title}</h3>
                  <p class="text-slate-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <span class="inline-flex items-center text-brand-500 font-bold text-sm group-hover:gap-2 transition-all">
                    View Service 
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
