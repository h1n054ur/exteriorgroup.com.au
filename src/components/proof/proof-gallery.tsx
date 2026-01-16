/**
 * ProofGallery Component
 * 
 * Displays projects in a responsive masonry-style grid.
 * Supports filtering by category via HTMX.
 */

import type { FC } from 'hono/jsx';
import type { Project } from '../../../db/schema';
import { ProofCard, ProofCardSkeleton } from './proof-card';

interface ProofGalleryProps {
  projects: Project[];
  loading?: boolean;
  showFilters?: boolean;
  activeCategory?: string;
}

/**
 * Category Filter Buttons
 */
const CategoryFilters: FC<{ activeCategory?: string }> = ({ activeCategory }) => {
  const categories = [
    { value: '', label: 'All Projects' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'painting', label: 'Painting' },
    { value: 'strata', label: 'Strata' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '2rem'
    }}>
      {categories.map(cat => {
        const isActive = activeCategory === cat.value || (!activeCategory && cat.value === '');
        return (
          <button
            type="button"
            hx-get={`/api/fragments/gallery${cat.value ? `?category=${cat.value}` : ''}`}
            hx-target="#gallery-grid"
            hx-swap="innerHTML"
            hx-indicator="#gallery-loading"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: isActive ? '#f59e0b' : '#f3f4f6',
              color: isActive ? 'white' : '#4b5563'
            }}
          >
            {cat.label}
          </button>
        );
      })}
      
      {/* Loading indicator */}
      <span 
        id="gallery-loading" 
        class="htmx-indicator"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
          marginLeft: '0.5rem'
        }}
      >
        Loading...
      </span>
    </div>
  );
};

/**
 * ProofGallery - Masonry grid of project cards
 */
export const ProofGallery: FC<ProofGalleryProps> = ({ 
  projects, 
  loading,
  showFilters = true,
  activeCategory 
}) => {
  return (
    <div>
      {showFilters && <CategoryFilters activeCategory={activeCategory} />}
      
      <div 
        id="gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {loading ? (
          // Show skeleton loaders
          Array.from({ length: 6 }).map((_, i) => (
            <ProofCardSkeleton key={i} />
          ))
        ) : projects.length > 0 ? (
          // Show project cards
          projects.map(project => (
            <ProofCard key={project.id} project={project} />
          ))
        ) : (
          // Empty state
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 2rem',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              No projects found
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Gallery Items Fragment - Just the cards without filters
 * Used for HTMX partial updates
 */
export const GalleryItemsFragment: FC<{ projects: Project[] }> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '4rem 2rem',
        color: '#6b7280'
      }}>
        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
          No projects found
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Try selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <>
      {projects.map(project => (
        <ProofCard key={project.id} project={project} />
      ))}
    </>
  );
};

export default ProofGallery;
