/**
 * BeforeAfterSlider Component
 * 
 * Interactive comparison slider for before/after images.
 * Uses CSS classes from design system (src/styles.css).
 * Touch-optimized for mobile.
 */

import type { FC } from 'hono/jsx';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number; // 0-100, default 50
}

/**
 * BeforeAfterSlider - Draggable comparison slider
 * 
 * Uses CSS classes:
 * - .before-after (container)
 * - .before-after-image (images)
 * - .before-after-before (clipped before image)
 * - .before-after-slider (handle bar)
 * - .before-after-handle (circular grip)
 * - .before-after-label, .before-after-label-before, .before-after-label-after
 */
export const BeforeAfterSlider: FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before transformation',
  afterAlt = 'After transformation',
  initialPosition = 50
}) => {
  const sliderId = `slider-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div id={sliderId} class="before-after">
      {/* After image (background - always fully visible) */}
      <img 
        src={afterImage}
        alt={afterAlt}
        class="before-after-image"
        loading="lazy"
      />
      
      {/* Before image (clipped by CSS clip-path) */}
      <img 
        src={beforeImage}
        alt={beforeAlt}
        class="before-after-image before-after-before"
        loading="lazy"
        style={`clip-path: inset(0 ${100 - initialPosition}% 0 0);`}
      />
      
      {/* Slider handle bar */}
      <div 
        class="before-after-slider"
        style={`left: ${initialPosition}%;`}
      >
        {/* Circular handle with arrows */}
        <div class="before-after-handle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M8 6l-4 6 4 6" />
            <path d="M16 6l4 6-4 6" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <span class="before-after-label before-after-label-before">Before</span>
      <span class="before-after-label before-after-label-after">After</span>
      
      {/* Slider behavior script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const container = document.getElementById('${sliderId}');
          if (!container) return;
          
          const beforeImage = container.querySelector('.before-after-before');
          const handle = container.querySelector('.before-after-slider');
          let isDragging = false;
          
          function updateSlider(x) {
            const rect = container.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Update clip-path on before image
            beforeImage.style.clipPath = 'inset(0 ' + (100 - percentage) + '% 0 0)';
            // Update handle position
            handle.style.left = percentage + '%';
          }
          
          // Mouse events
          container.addEventListener('mousedown', function(e) {
            isDragging = true;
            updateSlider(e.clientX);
            e.preventDefault();
          });
          
          document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            updateSlider(e.clientX);
          });
          
          document.addEventListener('mouseup', function() {
            isDragging = false;
          });
          
          // Touch events
          container.addEventListener('touchstart', function(e) {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
          }, { passive: true });
          
          container.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
          }, { passive: true });
          
          container.addEventListener('touchend', function() {
            isDragging = false;
          });
          
          // Keyboard accessibility
          handle.setAttribute('tabindex', '0');
          handle.setAttribute('role', 'slider');
          handle.setAttribute('aria-label', 'Before and after comparison slider');
          handle.setAttribute('aria-valuemin', '0');
          handle.setAttribute('aria-valuemax', '100');
          handle.setAttribute('aria-valuenow', '${initialPosition}');
          
          handle.addEventListener('keydown', function(e) {
            const rect = container.getBoundingClientRect();
            const currentLeft = parseFloat(handle.style.left) || ${initialPosition};
            let newPosition = currentLeft;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              newPosition = Math.max(0, currentLeft - 5);
              e.preventDefault();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              newPosition = Math.min(100, currentLeft + 5);
              e.preventDefault();
            }
            
            if (newPosition !== currentLeft) {
              beforeImage.style.clipPath = 'inset(0 ' + (100 - newPosition) + '% 0 0)';
              handle.style.left = newPosition + '%';
              handle.setAttribute('aria-valuenow', newPosition.toString());
            }
          });
        })();
      `}} />
    </div>
  );
};

export default BeforeAfterSlider;
