import type { FC } from 'hono/jsx';

export const CTASection: FC = () => (
  <section class="py-24 bg-brand-500 relative overflow-hidden">
    {/* Background Pattern */}
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="white" stroke-width="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>
    </div>

    <div class="container relative z-10">
      <div class="bg-white rounded-3xl p-8 md:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
        <div class="max-w-2xl text-center lg:text-left">
          <h2 class="text-3xl md:text-5xl font-heading font-extrabold text-brand-900 mb-6 leading-tight">
            Ready to transform your <br/><span class="text-brand-500">property's exterior?</span>
          </h2>
          <p class="text-xl text-slate-600 mb-0">
            Get a free, no-obligation quote today. Our team will assess your property 
            and provide a detailed proposal within 24 hours.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <a href="/enquire" class="btn-primary px-10 py-5 text-xl shadow-xl hover:shadow-2xl transition-all text-center">
            Get Your Free Quote
          </a>
          <a href="tel:1300123456" class="btn-secondary px-10 py-5 text-xl text-center">
            1300 123 456
          </a>
        </div>
      </div>
    </div>
  </section>
);
