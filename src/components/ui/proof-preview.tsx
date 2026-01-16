import type { FC } from 'hono/jsx';
import { BeforeAfterSlider } from '../proof/before-after-slider';

export const ProofPreview: FC = () => {
  return (
    <section id="results" class="py-20">
      <div class="container">
        <div class="section-head mb-12">
          <div class="max-w-2xl">
            <div class="kicker mb-2">Results</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Before & after, the satisfying version</h2>
            <p class="text-muted leading-relaxed">Drag the handle to compare. Real results from real local jobs.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-stretch">
          <div class="ba-wrap relative rounded-[26px] overflow-hidden border border-white/15 shadow-2xl bg-white/5 min-h-[400px] reveal">
            <BeforeAfterSlider 
              beforeImage="/api/assets/before-after/gutter-cleaning-2-before.jpg"
              afterImage="/api/assets/before-after/gutter-cleaning-2-after.jpg"
              beforeAlt="Dirty clogged gutters"
              afterAlt="Clean cleared gutters"
            />
          </div>

          <div class="flex flex-col gap-6">
            <div class="card p-8 reveal border border-white/15 bg-white/5">
              <h3 class="text-xl font-extrabold mb-3 tracking-tight">What “done right” looks like</h3>
              <p class="text-muted text-sm leading-relaxed mb-6">
                Surfaces cleaned without damage, edges finished, and the site left tidy. That’s the baseline.
              </p>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div class="text-2xl font-black tracking-tight mb-1">1–2h</div>
                  <div class="text-xs font-bold text-muted uppercase tracking-wide">Typical visit</div>
                </div>
                <div class="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div class="text-2xl font-black tracking-tight mb-1">0%</div>
                  <div class="text-xs font-bold text-muted uppercase tracking-wide">Guesswork</div>
                </div>
                <div class="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div class="text-2xl font-black tracking-tight mb-1">Safe</div>
                  <div class="text-xs font-bold text-muted uppercase tracking-wide">Pressure matched</div>
                </div>
                <div class="p-4 rounded-2xl border border-white/10 bg-white/5">
                  <div class="text-2xl font-black tracking-tight mb-1">Plan</div>
                  <div class="text-xs font-bold text-muted uppercase tracking-wide">Seasonal care</div>
                </div>
              </div>
            </div>

            <div class="card p-8 reveal border border-white/15 bg-white/5 flex items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="text-xs font-bold uppercase tracking-widest text-accent2">Quick Booking</div>
                <div class="text-lg font-black">Want this look?</div>
                <div class="text-sm text-muted">Tell us what you need, we’ll get back fast.</div>
              </div>
              <a class="btn primary py-3 px-6 text-sm" href="/enquire">
                Enquire
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
