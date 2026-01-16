/**
 * SlideOver Component
 * 
 * A slide-in panel for displaying project details.
 * Triggered via HTMX and controlled with vanilla JS.
 */

import type { FC, PropsWithChildren } from 'hono/jsx';

interface SlideOverProps extends PropsWithChildren {
  title?: string;
}

/**
 * SlideOver Container
 * Renders the shell that holds dynamic content loaded via HTMX
 */
export const SlideOverContainer: FC = () => (
  <>
    {/* Backdrop */}
    <div 
      id="slide-over-backdrop"
      onclick="closeSlideOver()"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 40,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s'
      }}
    />
    
    {/* Panel */}
    <div 
      id="slide-over-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '32rem',
        background: 'white',
        boxShadow: '-4px 0 6px -1px rgba(0,0,0,0.1)',
        zIndex: 50,
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        overflowY: 'auto'
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onclick="closeSlideOver()"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '0.375rem',
          color: '#6b7280',
          zIndex: 10
        }}
        aria-label="Close panel"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Content container */}
      <div id="slide-over-content" style={{ padding: '1.5rem' }}>
        {/* Content loaded via HTMX */}
      </div>
    </div>
    
    {/* Script for slide-over behavior */}
    <script dangerouslySetInnerHTML={{ __html: `
      function openSlideOver() {
        document.getElementById('slide-over-backdrop').style.opacity = '1';
        document.getElementById('slide-over-backdrop').style.pointerEvents = 'auto';
        document.getElementById('slide-over-panel').style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
      }
      
      function closeSlideOver() {
        document.getElementById('slide-over-backdrop').style.opacity = '0';
        document.getElementById('slide-over-backdrop').style.pointerEvents = 'none';
        document.getElementById('slide-over-panel').style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
      }
      
      // Open slide-over when content is loaded via HTMX
      document.body.addEventListener('htmx:afterSwap', function(evt) {
        if (evt.detail.target.id === 'slide-over-content') {
          openSlideOver();
        }
      });
      
      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSlideOver();
      });
    `}} />
  </>
);

/**
 * SlideOver Content Wrapper
 */
export const SlideOver: FC<SlideOverProps> = ({ children, title }) => (
  <div>
    {title && (
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '1rem',
        paddingRight: '2rem'
      }}>
        {title}
      </h2>
    )}
    {children}
  </div>
);

export default SlideOver;
