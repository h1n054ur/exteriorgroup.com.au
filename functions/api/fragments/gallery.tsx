/**
 * Gallery Fragment Routes
 * 
 * HTMX fragments for the project gallery.
 */

import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb } from '../../_shared/db';
import { projects } from '../../../db/schema';
import type { Env } from '../../_shared/auth';

const app = new Hono<{ Bindings: Env }>();

/**
 * Gallery items fragment with optional category filter
 * GET /api/fragments/gallery?category=roofing
 */
app.get('/', async (c) => {
  const category = c.req.query('category');
  const db = createDb(c.env.DB);
  
  const projectList = await db.select()
    .from(projects)
    .where(eq(projects.published, true));
  
  const filtered = category 
    ? projectList.filter(p => p.category === category)
    : projectList;
  
  return c.html(<GalleryItems projects={filtered} />);
});

import type { Project } from '../../../db/schema';

/**
 * Gallery Items Component
 */
const GalleryItems = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) {
    return (
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500">No projects found in this category.</p>
      </div>
    );
  }
  
  return (
    <>
      {projects.map(project => (
        <article 
          class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          key={project.id}
        >
          {/* Image */}
          <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
            {project.featuredImageKey ? (
              <img 
                src={`/api/assets/${project.featuredImageKey}`}
                alt={project.featuredImageAlt || project.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          
          {/* Content */}
          <div class="p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-medium text-amber-600 uppercase tracking-wide">
                {project.category}
              </span>
              {project.sector && (
                <>
                  <span class="text-gray-300">•</span>
                  <span class="text-xs text-gray-500 capitalize">{project.sector}</span>
                </>
              )}
            </div>
            
            <h3 class="font-heading font-bold text-lg mb-1 group-hover:text-amber-600 transition-colors">
              {project.title}
            </h3>
            
            {project.location && (
              <p class="text-sm text-gray-500 mb-3">{project.location}</p>
            )}
            
            <button
              type="button"
              class="text-sm font-medium text-amber-600 hover:text-amber-700"
              hx-get={`/api/fragments/project/${project.slug}`}
              hx-target="#slide-over-content"
              hx-trigger="click"
              onclick="document.getElementById('slide-over').classList.remove('hidden')"
            >
              View Details →
            </button>
          </div>
        </article>
      ))}
    </>
  );
};

export default app;
