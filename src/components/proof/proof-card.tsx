/**
 * ProofCard Component
 * 
 * Modernized project card for the gallery.
 * Uses design system classes and HTMX.
 */

import type { FC } from 'hono/jsx';
import type { Project } from '../../../db/schema';

interface ProofCardProps {
  project: Project;
  loading?: boolean;
}

export const ProofCard: FC<ProofCardProps> = ({ project, loading }) => {
  if (loading) {
    return <ProofCardSkeleton />;
  }

  const imageUrl = project.featuredImageKey 
    ? `/api/assets/${project.featuredImageKey}`
    : null;

  return (
    <article 
      class="proof-card group h-full flex flex-col"
      hx-get={`/api/fragments/project/${project.id}`}
      hx-target="#slide-over-content"
      hx-trigger="click"
      hx-swap="innerHTML"
    >
      {/* Image container */}
      <div class="proof-card-image">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={project.featuredImageAlt || project.title}
            loading="lazy"
          />
        ) : (
          <div class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            No image available
          </div>
        )}
        
        {/* Category badge */}
        <span class="proof-card-tag">
          {project.category}
        </span>

        {/* Before/After indicator */}
        {project.beforeImageKey && project.afterImageKey && (
          <div class="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1.5">
            <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v12a1 1 0 002 0V4zM11 4a1 1 0 10-2 0v12a1 1 0 102 0V4zM17 4a1 1 0 10-2 0v12a1 1 0 102 0V4z" />
            </svg>
            Interactive Proof
          </div>
        )}

        <div class="proof-card-overlay">
          <button class="proof-card-overlay-btn shadow-lg">
            View Case Study
          </button>
        </div>
      </div>

      {/* Content */}
      <div class="proof-card-content flex-1 flex flex-col">
        <div class="mb-auto">
          <h3 class="proof-card-title group-hover:text-brand-500 transition-colors">
            {project.title}
          </h3>
          
          {project.location && (
            <p class="proof-card-location mb-3">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </p>
          )}
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {project.sector} Sector
          </span>
          <span class="text-brand-500 font-bold text-sm">
            Details →
          </span>
        </div>
      </div>
    </article>
  );
};

export const ProofCardSkeleton: FC = () => (
  <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
    <div class="aspect-[4/3] skeleton"></div>
    <div class="p-6 space-y-3">
      <div class="h-6 w-3/4 skeleton"></div>
      <div class="h-4 w-1/2 skeleton"></div>
      <div class="pt-4 flex justify-between">
        <div class="h-3 w-1/4 skeleton"></div>
        <div class="h-3 w-1/4 skeleton"></div>
      </div>
    </div>
  </div>
);

export default ProofCard;
