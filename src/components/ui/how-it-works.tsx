import type { FC } from 'hono/jsx';

export const HowItWorks: FC = () => (
  <section class="py-20">
    <div class="container">
      <div class="section-head mb-12">
        <div class="max-w-2xl">
          <div class="kicker mb-2">How it works</div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Simple steps. Clean results.</h2>
          <p class="text-muted leading-relaxed">Fast estimate → book → we show up ready → walk-through at the end so you can confirm everything looks right.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { num: '1', title: 'Get a free estimate', desc: 'Tell us what you need (photos help). We’ll confirm scope and give you a clear quote.' },
          { num: '2', title: 'Book your service', desc: 'We lock in a time, send updates, and arrive ready with the right equipment for the job.' },
          { num: '3', title: 'Final walk-through', desc: 'We do a quick check with you at the end. If anything’s off, we fix it on the spot.' }
        ].map((step, i) => (
          <div class="card p-6 reveal border border-white/15 bg-white/5" style={{ transitionDelay: `${i * 100}ms` }}>
            <div class="flex items-center gap-4 mb-4">
              <div class="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-black text-accent">
                {step.num}
              </div>
              <h3 class="text-lg font-bold">{step.title}</h3>
            </div>
            <p class="text-muted text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
