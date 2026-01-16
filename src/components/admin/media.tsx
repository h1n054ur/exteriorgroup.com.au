/**
 * Media Management Components
 * 
 * Admin interface for R2 media upload and management.
 * Supports drag-and-drop upload with progress indication.
 */

import type { FC } from 'hono/jsx';

interface MediaItem {
  key: string;
  size: number;
  uploaded: string;
  httpMetadata?: {
    contentType?: string;
  };
}

interface MediaListProps {
  items: MediaItem[];
  prefix?: string;
}

/** Format file size */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Get file icon based on content type */
const getFileIcon = (contentType?: string): string => {
  if (!contentType) return '📄';
  if (contentType.startsWith('image/')) return '🖼️';
  if (contentType.startsWith('video/')) return '🎬';
  if (contentType.startsWith('audio/')) return '🎵';
  if (contentType === 'application/pdf') return '📕';
  return '📄';
};

/** Upload Zone */
export const UploadZone: FC<{ prefix?: string }> = ({ prefix = 'uploads' }) => (
  <div class="card" style={{ marginBottom: '1.5rem' }}>
    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Upload Files</h2>
    
    <form
      id="upload-form"
      hx-post="/api/admin/media/upload"
      hx-encoding="multipart/form-data"
      hx-target="#upload-result"
      hx-swap="innerHTML"
    >
      <input type="hidden" name="prefix" value={prefix} />
      
      <div
        id="drop-zone"
        style={{
          border: '2px dashed #374151',
          borderRadius: '0.75rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
          Drag and drop files here
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
          or click to browse
        </p>
        
        <input
          type="file"
          id="file-input"
          name="files"
          multiple
          accept="image/*,video/*,application/pdf"
          style={{ display: 'none' }}
        />
        
        <label for="file-input" class="btn btn-secondary" style={{ cursor: 'pointer' }}>
          Select Files
        </label>
      </div>
      
      <div id="file-list" style={{ marginTop: '1rem' }}></div>
      
      <button 
        type="submit" 
        id="upload-btn"
        class="btn btn-primary"
        style={{ marginTop: '1rem', display: 'none' }}
      >
        Upload Files
      </button>
    </form>
    
    <div id="upload-result" style={{ marginTop: '1rem' }}></div>
    
    {/* Client-side JavaScript for drag-and-drop */}
    <script>{`
      (function() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const fileList = document.getElementById('file-list');
        const uploadBtn = document.getElementById('upload-btn');
        
        // Click to browse
        dropZone.addEventListener('click', () => fileInput.click());
        
        // Drag events
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropZone.style.borderColor = '#f59e0b';
          dropZone.style.background = 'rgba(245, 158, 11, 0.05)';
        });
        
        dropZone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          dropZone.style.borderColor = '#374151';
          dropZone.style.background = 'transparent';
        });
        
        dropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropZone.style.borderColor = '#374151';
          dropZone.style.background = 'transparent';
          
          const dt = e.dataTransfer;
          fileInput.files = dt.files;
          updateFileList(dt.files);
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
          updateFileList(e.target.files);
        });
        
        function updateFileList(files) {
          if (files.length === 0) {
            fileList.innerHTML = '';
            uploadBtn.style.display = 'none';
            return;
          }
          
          fileList.innerHTML = Array.from(files).map(file => 
            '<div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; background: #374151; border-radius: 0.375rem; margin-bottom: 0.5rem;">' +
              '<span>' + (file.type.startsWith('image/') ? '🖼️' : '📄') + '</span>' +
              '<span style="flex: 1;">' + file.name + '</span>' +
              '<span style="color: #9ca3af; font-size: 0.75rem;">' + formatSize(file.size) + '</span>' +
            '</div>'
          ).join('');
          
          uploadBtn.style.display = 'inline-flex';
        }
        
        function formatSize(bytes) {
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
          return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
      })();
    `}</script>
  </div>
);

/** Upload Success */
export const UploadSuccess: FC<{ files: { key: string; url: string }[] }> = ({ files }) => (
  <div style={{
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #10b981',
    borderRadius: '0.5rem',
    padding: '1rem'
  }}>
    <p style={{ color: '#34d399', fontWeight: 500, marginBottom: '0.75rem' }}>
      ✓ {files.length} file{files.length !== 1 ? 's' : ''} uploaded successfully
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {files.map(file => (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem',
          background: '#374151',
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: '#9ca3af', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.key}
          </span>
          <button
            onclick={`navigator.clipboard.writeText('${file.url}'); this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy URL', 2000);`}
            class="btn btn-secondary"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            Copy URL
          </button>
        </div>
      ))}
    </div>
  </div>
);

/** Upload Error */
export const UploadError: FC<{ message: string }> = ({ message }) => (
  <div style={{
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    borderRadius: '0.5rem',
    padding: '1rem'
  }}>
    <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
      {message}
    </p>
  </div>
);

/** Media Library */
export const MediaLibrary: FC<MediaListProps> = ({ items, prefix }) => (
  <div>
    {/* Folder Navigation */}
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <a
        href="/admin/media"
        class="btn"
        style={{
          background: !prefix ? '#f59e0b' : '#374151',
          color: !prefix ? '#1f2937' : '#f9fafb',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem'
        }}
      >
        All Files
      </a>
      <a
        href="/admin/media?prefix=projects"
        class="btn"
        style={{
          background: prefix === 'projects' ? '#f59e0b' : '#374151',
          color: prefix === 'projects' ? '#1f2937' : '#f9fafb',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem'
        }}
      >
        Projects
      </a>
      <a
        href="/admin/media?prefix=uploads"
        class="btn"
        style={{
          background: prefix === 'uploads' ? '#f59e0b' : '#374151',
          color: prefix === 'uploads' ? '#1f2937' : '#f9fafb',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem'
        }}
      >
        Uploads
      </a>
    </div>

    {items.length === 0 ? (
      <div class="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#9ca3af' }}>
          No files found{prefix ? ` in ${prefix}/` : ''}.
        </p>
      </div>
    ) : (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {items.map(item => {
          const isImage = item.httpMetadata?.contentType?.startsWith('image/');
          const fileName = item.key.split('/').pop() || item.key;
          
          return (
            <div 
              class="card" 
              style={{ 
                padding: '0.75rem', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              {/* Preview */}
              <div style={{
                aspectRatio: '1',
                background: '#374151',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {isImage ? (
                  <img 
                    src={`/api/assets/${item.key}`}
                    alt={fileName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <span style={{ fontSize: '2rem' }}>
                    {getFileIcon(item.httpMetadata?.contentType)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div>
                <p style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={fileName}>
                  {fileName}
                </p>
                <p style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                  {formatFileSize(item.size)}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: 'auto' }}>
                <button
                  onclick={`navigator.clipboard.writeText('/api/assets/${item.key}'); this.innerText = '✓'; setTimeout(() => this.innerText = 'Copy', 1500);`}
                  class="btn btn-secondary"
                  style={{ flex: 1, padding: '0.25rem', fontSize: '0.625rem' }}
                >
                  Copy
                </button>
                <button
                  class="btn btn-danger"
                  style={{ padding: '0.25rem', fontSize: '0.625rem' }}
                  hx-delete={`/api/admin/media/${encodeURIComponent(item.key)}`}
                  hx-confirm={`Delete ${fileName}?`}
                  hx-target="closest .card"
                  hx-swap="outerHTML"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

/** Media Content (combines upload zone and library) */
export const MediaContent: FC<MediaListProps> = ({ items, prefix }) => (
  <div>
    <UploadZone prefix={prefix || 'uploads'} />
    <MediaLibrary items={items} prefix={prefix} />
  </div>
);

/** File Deleted */
export const FileDeleted: FC = () => (
  <div style={{
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px dashed #ef4444',
    borderRadius: '0.75rem',
    padding: '1rem',
    textAlign: 'center',
    color: '#fca5a5',
    fontSize: '0.75rem'
  }}>
    File deleted
  </div>
);

export default MediaContent;
