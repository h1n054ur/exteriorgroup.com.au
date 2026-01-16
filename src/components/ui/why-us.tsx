import type { FC } from 'hono/jsx';

export const WhyUs: FC = () => (
  <section id="why" class="py-20">
    <div class="container">
      <div class="section-head mb-12">
        <div class="max-w-2xl">
          <div class="kicker mb-2">Why us</div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">A clean you can rely on</h2>
          <p class="text-muted leading-relaxed">We focus on three things: the right tools, safe methods, and communication you don’t have to chase.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div class="card p-8 reveal border border-white/15 bg-white/5">
          <h3 class="text-2xl font-extrabold mb-6 tracking-tight">What you’ll notice</h3>
          <ul class="space-y-4">
            {[
              'Professional-grade equipment tuned for each surface.',
              'Clear updates before arrival and when the job is done.',
              'Detail work: edges, corners, sills, and tidy clean-up.',
              'Options for ongoing, seasonal maintenance.'
            ].map(item => (
              <li class="flex items-start gap-4 text-muted leading-relaxed">
                <div class="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div class="promise p-8 rounded-[18px] border border-accent/35 bg-gradient-to-b from-accent/10 to-white/5 relative overflow-hidden reveal">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          
          <div class="relative z-10 space-y-6">
            <div class="flex items-center justify-between gap-4">
              <div class="text-2xl font-black tracking-tight">Make-it-right promise</div>
              <span class="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/90">48h re-clean</span>
            </div>
            
            <p class="text-muted leading-relaxed text-lg">If something isn’t right, tell us within 48 hours and we’ll return to re-clean the affected area — no extra charge.</p>
            
            <div class="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span class="text-sm font-black uppercase tracking-widest text-accent2">Zero drama. Fast fix.</span>
              <a class="btn primary py-2.5 px-6 text-sm" href="/enquire">
                Enquire
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7M9 7h8v8"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
