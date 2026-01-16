/**
 * ProjectDetail Component
 * 
 * Full project details displayed in a slide-over.
 * Includes before/after slider, description, and metadata.
 */

import type { FC } from 'hono/jsx';
import type { Project } from '../../../db/schema';
import { BeforeAfterSlider } from './before-after-slider';

interface ProjectDetailProps {
  project: Project;
  renderedContent?: string; // Pre-rendered markdown
}

/**
 * ProjectDetail - Full project view
 */
export const ProjectDetail: FC<ProjectDetailProps> = ({ project, renderedContent }) => {
  const hasBeforeAfter = project.beforeImageKey && project.afterImageKey;
  const featuredImage = project.featuredImageKey 
    ? `/api/assets/${project.featuredImageKey}`
    : null;

  const categoryColors: Record<string, string> = {
    roofing: '#ef4444',
    painting: '#3b82f6',
    strata: '#10b981',
  };

  const categoryColor = categoryColors[project.category] || '#6b7280';

  return (
    <article>
      {/* Header */}
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <span style={{
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
          <span style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            textTransform: 'capitalize'
          }}>
            {project.sector}
          </span>
        </div>
        
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: 1.2
        }}>
          {project.title}
        </h2>
        
        {project.location && (
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            📍 {project.location}
          </p>
        )}
      </header>

      {/* Before/After Slider or Featured Image */}
      <div style={{ marginBottom: '1.5rem' }}>
        {hasBeforeAfter ? (
          <BeforeAfterSlider
            beforeImage={`/api/assets/${project.beforeImageKey}`}
            afterImage={`/api/assets/${project.afterImageKey}`}
            beforeAlt={`${project.title} - Before`}
            afterAlt={`${project.title} - After`}
          />
        ) : featuredImage ? (
          <img 
            src={featuredImage}
            alt={project.featuredImageAlt || project.title}
            style={{
              width: '100%',
              borderRadius: '0.5rem',
              aspectRatio: '16/10',
              objectFit: 'cover'
            }}
          />
        ) : null}
      </div>

      {/* Description */}
      {renderedContent ? (
        <div 
          class="prose"
          style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#374151'
          }}
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      ) : project.description ? (
        <div style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#374151',
          whiteSpace: 'pre-wrap'
        }}>
          {project.description}
        </div>
      ) : project.excerpt ? (
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#374151'
        }}>
          {project.excerpt}
        </p>
      ) : null}

      {/* Client info */}
      {project.clientName && (
        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            <strong>Client:</strong> {project.clientName}
          </p>
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/enquire" 
          class="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
            color: 'white',
            fontWeight: 600,
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}
        >
          Get a Similar Quote
        </a>
      </div>
    </article>
  );
};

export default ProjectDetail;
