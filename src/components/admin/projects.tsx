/**
 * Project Management Components
 * 
 * Admin interface for managing portfolio projects.
 * Supports CRUD operations with Markdown editor.
 */

import type { FC } from 'hono/jsx';
import type { Project } from '../../../db/schema';

interface ProjectsListProps {
  projects: Project[];
  totalCount: number;
}

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
  error?: string;
}

const CATEGORY_OPTIONS = ['roofing', 'painting', 'strata'] as const;
const SECTOR_OPTIONS = ['commercial', 'residential'] as const;

/** Projects List */
export const ProjectsListContent: FC<ProjectsListProps> = ({ projects, totalCount }) => (
  <div>
    {/* Header Actions */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <p style={{ color: '#9ca3af' }}>
        {totalCount} project{totalCount !== 1 ? 's' : ''} total
      </p>
      <a href="/admin/projects/new" class="btn btn-primary">
        + Add Project
      </a>
    </div>

    {projects.length === 0 ? (
      <div class="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
          No projects yet. Add your first project to showcase your work.
        </p>
        <a href="/admin/projects/new" class="btn btn-primary">Add First Project</a>
      </div>
    ) : (
      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map(project => (
          <div class="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* Thumbnail */}
            <div style={{
              width: '120px',
              height: '90px',
              background: '#374151',
              borderRadius: '0.5rem',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '0.75rem'
            }}>
              {project.featuredImageKey ? (
                <img 
                  src={`/api/assets/${project.featuredImageKey}`}
                  alt={project.featuredImageAlt || project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }}
                />
              ) : (
                'No image'
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {project.location || 'No location'} • {project.category} • {project.sector}
                  </p>
                </div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: project.published ? '#10b981' : '#6b7280',
                  color: 'white'
                }}>
                  {project.published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              {project.excerpt && (
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#9ca3af', 
                  marginTop: '0.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.excerpt}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <a 
                  href={`/admin/projects/${project.id}/edit`}
                  class="btn btn-secondary"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                >
                  Edit
                </a>
                {project.published ? (
                  <a 
                    href={`/gallery`}
                    target="_blank"
                    class="btn btn-secondary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    View ↗
                  </a>
                ) : (
                  <button 
                    class="btn btn-secondary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                    hx-post={`/api/admin/projects/${project.id}/publish`}
                    hx-swap="none"
                    hx-confirm="Publish this project?"
                  >
                    Publish
                  </button>
                )}
                <button 
                  class="btn btn-danger"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', marginLeft: 'auto' }}
                  hx-delete={`/api/admin/projects/${project.id}`}
                  hx-confirm="Are you sure you want to delete this project?"
                  hx-target="closest .card"
                  hx-swap="outerHTML"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/** Project Form (Create/Edit) */
export const ProjectFormContent: FC<ProjectFormProps> = ({ project, isEdit, error }) => (
  <div style={{ maxWidth: '800px' }}>
    {error && (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        marginBottom: '1rem'
      }}>
        <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
      </div>
    )}

    <form 
      method="post" 
      action={isEdit ? `/admin/projects/${project?.id}` : '/admin/projects'}
      enctype="multipart/form-data"
    >
      {/* Basic Information */}
      <div class="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Basic Information</h2>
        
        <div class="form-group">
          <label class="form-label" for="title">Project Title *</label>
          <input 
            type="text"
            id="title"
            name="title"
            class="form-input"
            value={project?.title || ''}
            required
            placeholder="e.g., Sydney CBD Commercial Complex Roof Restoration"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="slug">URL Slug *</label>
          <input 
            type="text"
            id="slug"
            name="slug"
            class="form-input"
            value={project?.slug || ''}
            required
            pattern="[a-z0-9-]+"
            placeholder="e.g., sydney-cbd-commercial-roof"
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Lowercase letters, numbers, and hyphens only
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div class="form-group">
            <label class="form-label" for="category">Category *</label>
            <select id="category" name="category" class="form-input form-select" required>
              {CATEGORY_OPTIONS.map(cat => (
                <option value={cat} selected={project?.category === cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="sector">Sector *</label>
            <select id="sector" name="sector" class="form-input form-select" required>
              {SECTOR_OPTIONS.map(sec => (
                <option value={sec} selected={project?.sector === sec}>
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div class="form-group">
            <label class="form-label" for="clientName">Client Name</label>
            <input 
              type="text"
              id="clientName"
              name="clientName"
              class="form-input"
              value={project?.clientName || ''}
              placeholder="e.g., Strata Corp Australia"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="location">Location</label>
            <input 
              type="text"
              id="location"
              name="location"
              class="form-input"
              value={project?.location || ''}
              placeholder="e.g., Sydney CBD, NSW"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="completedAt">Completion Date</label>
          <input 
            type="date"
            id="completedAt"
            name="completedAt"
            class="form-input"
            value={project?.completedAt?.split('T')[0] || ''}
          />
        </div>
      </div>

      {/* Content */}
      <div class="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Content</h2>
        
        <div class="form-group">
          <label class="form-label" for="excerpt">Excerpt</label>
          <input 
            type="text"
            id="excerpt"
            name="excerpt"
            class="form-input"
            value={project?.excerpt || ''}
            placeholder="Brief summary for cards and listings"
            maxLength={200}
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="description">Description (Markdown) *</label>
          <textarea 
            id="description"
            name="description"
            class="form-input form-textarea"
            required
            rows={12}
            placeholder="## Project Overview&#10;&#10;Describe the project scope, challenges, and solutions...&#10;&#10;## Results&#10;&#10;List the outcomes and client satisfaction..."
            style={{ fontFamily: 'monospace' }}
          >{project?.description || ''}</textarea>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Supports Markdown formatting (headings, lists, bold, etc.)
          </p>
        </div>
      </div>

      {/* Media */}
      <div class="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Media</h2>
        
        <div class="form-group">
          <label class="form-label" for="featuredImage">Featured Image</label>
          {project?.featuredImageKey && (
            <div style={{ marginBottom: '0.5rem' }}>
              <img 
                src={`/api/assets/${project.featuredImageKey}`}
                alt="Current featured image"
                style={{ maxWidth: '200px', borderRadius: '0.5rem' }}
              />
              <input type="hidden" name="existingFeaturedImage" value={project.featuredImageKey} />
            </div>
          )}
          <input 
            type="file"
            id="featuredImage"
            name="featuredImage"
            class="form-input"
            accept="image/*"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="featuredImageAlt">Image Alt Text</label>
          <input 
            type="text"
            id="featuredImageAlt"
            name="featuredImageAlt"
            class="form-input"
            value={project?.featuredImageAlt || ''}
            placeholder="Describe the image for accessibility"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div class="form-group">
            <label class="form-label" for="beforeImage">Before Image</label>
            {project?.beforeImageKey && (
              <div style={{ marginBottom: '0.5rem' }}>
                <img 
                  src={`/api/assets/${project.beforeImageKey}`}
                  alt="Current before image"
                  style={{ maxWidth: '150px', borderRadius: '0.5rem' }}
                />
                <input type="hidden" name="existingBeforeImage" value={project.beforeImageKey} />
              </div>
            )}
            <input 
              type="file"
              id="beforeImage"
              name="beforeImage"
              class="form-input"
              accept="image/*"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="afterImage">After Image</label>
            {project?.afterImageKey && (
              <div style={{ marginBottom: '0.5rem' }}>
                <img 
                  src={`/api/assets/${project.afterImageKey}`}
                  alt="Current after image"
                  style={{ maxWidth: '150px', borderRadius: '0.5rem' }}
                />
                <input type="hidden" name="existingAfterImage" value={project.afterImageKey} />
              </div>
            )}
            <input 
              type="file"
              id="afterImage"
              name="afterImage"
              class="form-input"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div class="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>SEO</h2>
        
        <div class="form-group">
          <label class="form-label" for="metaTitle">Meta Title</label>
          <input 
            type="text"
            id="metaTitle"
            name="metaTitle"
            class="form-input"
            value={project?.metaTitle || ''}
            placeholder="Custom page title for search engines"
            maxLength={60}
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="metaDescription">Meta Description</label>
          <textarea 
            id="metaDescription"
            name="metaDescription"
            class="form-input"
            rows={3}
            placeholder="Description for search engine results"
            maxLength={160}
          >{project?.metaDescription || ''}</textarea>
        </div>
      </div>

      {/* Publishing */}
      <div class="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Publishing</h2>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            name="published"
            value="true"
            checked={project?.published}
            style={{ width: '1.25rem', height: '1.25rem', accentColor: '#f59e0b' }}
          />
          <span>Publish this project (visible on public gallery)</span>
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button type="submit" class="btn btn-primary">
          {isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <a href="/admin/projects" class="btn btn-secondary">
          Cancel
        </a>
      </div>
    </form>
  </div>
);

/** Project Deleted Fragment */
export const ProjectDeleted: FC = () => (
  <div style={{
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px dashed #ef4444',
    borderRadius: '0.75rem',
    padding: '1rem',
    textAlign: 'center',
    color: '#fca5a5',
    fontSize: '0.875rem'
  }}>
    Project deleted
  </div>
);

export default ProjectsListContent;
