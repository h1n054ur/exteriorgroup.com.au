import type { FC } from 'hono/jsx';

export const ContentSection: FC = () => (
  <section class="py-24 bg-white overflow-hidden">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="relative">
          {/* Main Image */}
          <div class="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
            <img src="/api/assets/content-v1-img.jpg" alt="Professional cleaning service" class="w-full h-auto" />
          </div>
          
          {/* Floating Guarantee Badge */}
          <div class="absolute -bottom-10 -right-10 z-20 bg-brand-500 p-8 rounded-2xl shadow-2xl border-4 border-white max-w-[240px] hidden md:block">
            <div class="text-amber-500 text-4xl font-heading font-black mb-1">48hr</div>
            <div class="text-white font-bold text-xl leading-tight mb-2">Re-clean Guarantee</div>
            <p class="text-white/70 text-sm">Not satisfied? We'll return within 48 hours to make it right. No questions asked.</p>
          </div>

          {/* Decorative Elements */}
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl"></div>
        </div>

        <div class="space-y-8">
          <div class="inline-block px-4 py-1 rounded-md bg-brand-50 text-brand-500 font-bold text-sm uppercase tracking-widest">
            The Exterior Group Difference
          </div>
          <h2 class="text-4xl md:text-5xl font-heading font-extrabold text-brand-900 leading-tight">
            Better tools for <br/><span class="text-brand-500">better results</span>
          </h2>
          <p class="text-xl text-slate-600 leading-relaxed">
            When you turn to our team of cleaning professionals, you can count on a higher 
            level of clean. We don’t limit ourselves to tidying up at the ground level. 
            We use ladders and tools to get at those hard-to-reach spots.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-brand-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-brand-900 mb-1">Gutter Cameras</h4>
                <p class="text-slate-500 text-sm">Extreme close-ups to see clogs and deformities for accurate quotes.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-brand-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-brand-900 mb-1">Pro Equipment</h4>
                <p class="text-slate-500 text-sm">Professional grade washers tuned for your specific surface.</p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <a href="/enquire" class="btn-primary px-8 py-4 text-lg">
              Schedule Your Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
