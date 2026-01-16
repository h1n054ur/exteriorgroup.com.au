/**
 * SlideOver Component
 * 
 * Modernized slide-in panel for project details.
 * Uses design system classes and HTMX.
 */

import type { FC, PropsWithChildren } from 'hono/jsx';

export const SlideOverContainer: FC = () => (
  <div id="slide-over" class="slide-over">
    <div 
      class="slide-over-backdrop"
      onclick="document.getElementById('slide-over').classList.remove('open'); setTimeout(() => document.getElementById('slide-over').classList.add('hidden'), 300);"
    ></div>
    <div class="slide-over-panel">
      <button
        type="button"
        class="slide-over-close"
        onclick="document.getElementById('slide-over').classList.remove('open'); setTimeout(() => document.getElementById('slide-over').classList.add('hidden'), 300);"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div id="slide-over-content" class="h-full overflow-y-auto p-8 pt-20">
        {/* Content loaded via HTMX */}
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="skeleton w-16 h-16 rounded-full mx-auto mb-6"></div>
            <div class="skeleton h-4 w-48 mx-auto mb-3"></div>
            <div class="skeleton h-4 w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{ __html: `
      document.body.addEventListener('htmx:afterSwap', function(evt) {
        if (evt.detail.target.id === 'slide-over-content') {
          const slideOver = document.getElementById('slide-over');
          slideOver.classList.remove('hidden');
          setTimeout(() => slideOver.classList.add('open'), 10);
        }
      });
    `}} />
  </div>
);

export const SlideOver: FC<PropsWithChildren<{ title?: string }>> = ({ children, title }) => (
  <div class="animate-in fade-in slide-in-from-right duration-300">
    {title && (
      <h2 class="text-3xl font-heading font-extrabold text-brand-900 mb-6">{title}</h2>
    )}
    {children}
  </div>
);

export default SlideOverContainer;
