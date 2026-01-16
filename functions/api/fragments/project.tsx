/**
 * Project Detail Fragment
 * 
 * HTMX fragment for project slide-over details.
 */

import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { marked } from 'marked';
import { createDb } from '../../_shared/db';
import { projects } from '../../../db/schema';
import type { Env } from '../../_shared/auth';

const app = new Hono<{ Bindings: Env }>();

/**
 * Project detail fragment
 * GET /api/fragments/project/:slug
 */
app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = createDb(c.env.DB);
  
  const [project] = await db.select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);
  
  if (!project) {
    return c.html(
      <div class="p-8 text-center text-gray-500">
        Project not found
      </div>
    );
  }
  
  const renderedContent = project.description 
    ? await marked.parse(project.description) 
    : '';
  
  return c.html(<ProjectDetail project={project} content={renderedContent} />);
});

import type { Project } from '../../../db/schema';

/**
 * Project Detail Component
 */
const ProjectDetail = ({ 
  project, 
  content 
}: { 
  project: Project;
  content: string;
}) => (
  <div class="h-full overflow-y-auto">
    {/* Header Image */}
    {project.featuredImageKey && (
      <div class="aspect-video bg-gray-100">
        <img 
          src={`/api/assets/${project.featuredImageKey}`}
          alt={project.featuredImageAlt || project.title}
          class="w-full h-full object-cover"
        />
      </div>
    )}
    
    {/* Content */}
    <div class="p-6">
      {/* Meta */}
      <div class="flex items-center gap-2 mb-3">
        <span class="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full uppercase">
          {project.category}
        </span>
        <span class="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full capitalize">
          {project.sector}
        </span>
      </div>
      
      {/* Title */}
      <h2 class="font-heading text-2xl font-bold mb-2">
        {project.title}
      </h2>
      
      {/* Location & Client */}
      <div class="text-sm text-gray-500 mb-6 space-y-1">
        {project.location && <p>📍 {project.location}</p>}
        {project.clientName && <p>🏢 {project.clientName}</p>}
        {project.completedAt && (
          <p>📅 Completed {new Date(project.completedAt).toLocaleDateString('en-AU', {
            month: 'long',
            year: 'numeric'
          })}</p>
        )}
      </div>
      
      {/* Before/After Slider */}
      {project.beforeImageKey && project.afterImageKey && (
        <div class="mb-6">
          <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">
            Transformation
          </h3>
          <div 
            class="before-after-slider relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
            data-before={`/api/assets/${project.beforeImageKey}`}
            data-after={`/api/assets/${project.afterImageKey}`}
          >
            <img 
              src={`/api/assets/${project.afterImageKey}`}
              alt="After"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              Drag to compare
            </div>
          </div>
        </div>
      )}
      
      {/* Description */}
      <div 
        class="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* CTA */}
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-600 mb-4">
          Interested in a similar project?
        </p>
        <a 
          href={`/enquire?service=${project.category}&sector=${project.sector}`}
          class="btn-primary"
        >
          Get a Free Quote
        </a>
      </div>
    </div>
  </div>
);

export default app;
