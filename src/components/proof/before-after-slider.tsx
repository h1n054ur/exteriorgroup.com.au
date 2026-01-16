/**
 * BeforeAfterSlider Component
 * 
 * Interactive comparison slider for before/after images.
 * Touch-optimized for mobile.
 */

import type { FC } from 'hono/jsx';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

/**
 * BeforeAfterSlider - Draggable comparison slider
 */
export const BeforeAfterSlider: FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = 'Before',
  afterAlt = 'After'
}) => {
  const sliderId = `slider-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div 
      id={sliderId}
      class="before-after-slider"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/10',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        cursor: 'ew-resize',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      {/* After image (background) */}
      <img 
        src={afterImage}
        alt={afterAlt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      {/* Before image (clipped) */}
      <div 
        class="before-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <img 
          src={beforeImage}
          alt={beforeAlt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none'
          }}
        />
      </div>
      
      {/* Slider handle */}
      <div 
        class="slider-handle"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: '4px',
          height: '100%',
          background: 'white',
          transform: 'translateX(-50%)',
          cursor: 'ew-resize',
          boxShadow: '0 0 4px rgba(0,0,0,0.3)'
        }}
      >
        {/* Handle grip */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
            <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" />
          </svg>
        </div>
      </div>
      
      {/* Labels */}
      <div style={{
        position: 'absolute',
        bottom: '0.75rem',
        left: '0.75rem',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        Before
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0.75rem',
        right: '0.75rem',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        After
      </div>
      
      {/* Slider behavior script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const container = document.getElementById('${sliderId}');
          if (!container) return;
          
          const beforeContainer = container.querySelector('.before-container');
          const handle = container.querySelector('.slider-handle');
          let isDragging = false;
          
          function updateSlider(x) {
            const rect = container.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            beforeContainer.style.width = percentage + '%';
            handle.style.left = percentage + '%';
          }
          
          container.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
          });
          
          document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
          });
          
          document.addEventListener('mouseup', () => {
            isDragging = false;
          });
          
          // Touch support
          container.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
          }, { passive: true });
          
          container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
          }, { passive: true });
          
          container.addEventListener('touchend', () => {
            isDragging = false;
          });
        })();
      `}} />
    </div>
  );
};

export default BeforeAfterSlider;
