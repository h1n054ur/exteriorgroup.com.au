import type { FC } from 'hono/jsx';

export const HeroSection: FC = () => (
  <section class="hero min-h-[85vh] flex items-center py-10 md:py-20 overflow-hidden">
    <div class="container hero-grid grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
      <div class="reveal">
        <span class="pill mb-6">
          <span class="dot" aria-hidden="true"></span>
          <span class="text-muted font-bold text-sm">Premium exterior cleaning — residential & commercial</span>
        </span>

        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.02] mb-6">
          Make your exterior look <br/>
          <span class="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">brand-new</span>.
        </h1>
        
        <p class="text-muted text-lg leading-relaxed max-w-2xl mb-10">
          Windows, gutters, soft washing and pressure washing — done with professional tools, safe methods,
          and the kind of communication that makes the whole job feel effortless.
        </p>

        <div class="flex flex-wrap gap-4 mb-8">
          <a class="btn primary px-8 py-4 text-lg" href="/enquire">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" stroke-linejoin="round"/>
            </svg>
            Get a fast quote
          </a>
          <a class="btn px-8 py-4 text-lg" href="/#services">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
            </svg>
            Explore services
          </a>
        </div>

        <div class="flex flex-wrap gap-3">
          <span class="badge flex items-center gap-2.5 px-3 py-2 border border-white/10 bg-white/5 rounded-xl text-sm font-bold text-muted">
            <svg class="w-4 h-4 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" /></svg>
            <span class="text-text">4.9</span> average rating
          </span>
          <span class="badge flex items-center gap-2.5 px-3 py-2 border border-white/10 bg-white/5 rounded-xl text-sm font-bold text-muted">
            <svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            On-time arrival + updates
          </span>
          <span class="badge flex items-center gap-2.5 px-3 py-2 border border-white/10 bg-white/5 rounded-xl text-sm font-bold text-muted">
            <svg class="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V7l-8-4-8 4v5c0 6 8 10 8 10Z" stroke-linejoin="round"/></svg>
            Insured & safety-first
          </span>
        </div>
      </div>

      <div class="hero-card relative rounded-[26px] border border-white/15 bg-gradient-to-b from-white/10 to-white/5 overflow-hidden shadow-2xl min-h-[420px] reveal" data-parallax>
        {/* Background Image from R2 */}
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 z-0">
          <img src="/api/assets/corporate/hero-main.png" alt="" class="w-full h-full object-cover scale-105" />
        </div>
        <div class="absolute inset-0 bg-radial-gradient(800px 500px at 40% 20%, transparent, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.62)) z-10"></div>

        <div class="quote absolute left-4 right-4 bottom-4 p-5 rounded-2xl border border-white/15 bg-black/55 backdrop-blur-md z-20">
          <div class="stars flex gap-1 mb-2.5">
            {[1,2,3,4,5].map(() => (
              <svg class="w-4 h-4 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7Z"/></svg>
            ))}
          </div>
          <p class="text-white/85 text-sm leading-relaxed italic mb-3">
            “Prompt, professional, and the finish was unreal. They left everything spotless and walked me through the results before wrapping up.”
          </p>
          <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted2">
            <span>— Recent customer</span>
            <span class="px-2.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/90">Before → After</span>
          </div>
        </div>
      </div>
    </div>
    
    <script dangerouslySetInnerHTML={{ __html: `
      const parallaxEl = document.querySelector('[data-parallax]');
      let raf = null;
      function parallaxMove(e){
        if (!parallaxEl) return;
        const rect = parallaxEl.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          parallaxEl.style.transform = \`translateY(0) rotateX(\${(-dy*3).toFixed(2)}deg) rotateY(\${(dx*4).toFixed(2)}deg)\`;
        });
      }
      if (parallaxEl && window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
        window.addEventListener("mousemove", parallaxMove, { passive:true });
        window.addEventListener("mouseleave", () => parallaxEl.style.transform = "", { passive:true });
      }
    `}} />
  </section>
);
