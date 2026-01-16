import type { FC } from 'hono/jsx';
import { BeforeAfterSlider } from '../proof/before-after-slider';

export const ProofPreview: FC = () => {
  return (
    <section class="py-24 bg-slate-50">
      <div class="container">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-brand-900 mb-6">See the Difference</h2>
          <p class="text-lg text-slate-600">
            Results you can rely on. Our work is exterior cleaning, but our mission is 
            creating extraordinary experiences.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gutter Cleaning Comparison */}
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-heading text-2xl font-bold text-brand-900">Gutter Cleaning</h3>
              <span class="px-3 py-1 bg-brand-50 text-brand-500 rounded-full text-sm font-bold">Residential</span>
            </div>
            <div class="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <BeforeAfterSlider 
                beforeImage="/api/assets/before-after/gutter-cleaning-2-before.jpg"
                afterImage="/api/assets/before-after/gutter-cleaning-2-after.jpg"
                beforeAlt="Dirty clogged gutters"
                afterAlt="Clean cleared gutters"
              />
            </div>
            <p class="text-slate-500 italic text-center">Slide to see the transformation</p>
          </div>

          {/* House Washing Comparison */}
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="font-heading text-2xl font-bold text-brand-900">House Washing</h3>
              <span class="px-3 py-1 bg-brand-50 text-brand-500 rounded-full text-sm font-bold">Soft Wash</span>
            </div>
            <div class="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <BeforeAfterSlider 
                beforeImage="/api/assets/before-after/Before-Housewash.jpg"
                afterImage="/api/assets/before-after/After-Housewash.jpg"
                beforeAlt="Stained house siding"
                afterAlt="Clean house siding"
              />
            </div>
            <p class="text-slate-500 italic text-center">Slide to see the transformation</p>
          </div>
        </div>
        
        <div class="text-center mt-16">
          <a href="/why-us" class="btn-primary px-10 py-5 text-xl">
            See More Results
            <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
