/**
 * ProofCard Component
 * 
 * Displays a single project in the gallery with:
 * - Skeleton loader while image loads
 * - Before/After slider support
 * - Category badge
 * - Click to view details
 */

import type { FC } from 'hono/jsx';
import type { Project } from '../../../db/schema';

interface ProofCardProps {
  project: Project;
  loading?: boolean;
}

/**
 * Skeleton loader for ProofCard
 */
export const ProofCardSkeleton: FC = () => (
  <div style={{
    background: 'white',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    {/* Image skeleton */}
    <div style={{
      aspectRatio: '4/3',
      background: '#e5e7eb',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }} />
    {/* Content skeleton */}
    <div style={{ padding: '1rem' }}>
      <div style={{
        height: '1.5rem',
        width: '70%',
        background: '#e5e7eb',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
      <div style={{
        height: '1rem',
        width: '50%',
        background: '#e5e7eb',
        borderRadius: '0.25rem',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }} />
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}} />
  </div>
);

/**
 * ProofCard - Displays a project in the gallery
 */
export const ProofCard: FC<ProofCardProps> = ({ project, loading }) => {
  if (loading) {
    return <ProofCardSkeleton />;
  }

  const imageUrl = project.featuredImageKey 
    ? `/api/assets/${project.featuredImageKey}`
    : null;

  const categoryColors: Record<string, string> = {
    roofing: '#ef4444',
    painting: '#3b82f6',
    strata: '#10b981',
  };

  const categoryColor = categoryColors[project.category] || '#6b7280';

  return (
    <article 
      style={{
        background: 'white',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      hx-get={`/api/fragments/project/${project.slug}`}
      hx-target="#slide-over-content"
      hx-trigger="click"
      hx-swap="innerHTML"
    >
      {/* Image container */}
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f3f4f6' }}>
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={project.featuredImageAlt || project.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            No image
          </div>
        )}
        
        {/* Category badge */}
        <span style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          background: categoryColor,
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}>
          {project.category}
        </span>

        {/* Before/After indicator */}
        {project.beforeImageKey && project.afterImageKey && (
          <span style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.625rem',
            fontWeight: 500
          }}>
            Before/After
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 600,
          marginBottom: '0.25rem',
          color: '#111827'
        }}>
          {project.title}
        </h3>
        
        {project.location && (
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            📍 {project.location}
          </p>
        )}
        
        {project.excerpt && (
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {project.excerpt}
          </p>
        )}

        <div style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'capitalize'
          }}>
            {project.sector}
          </span>
          <span style={{
            color: '#f59e0b',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}>
            View Proof →
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProofCard;
