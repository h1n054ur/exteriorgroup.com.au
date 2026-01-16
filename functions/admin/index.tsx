/**
 * Admin Routes
 * 
 * Protected administrative routes for managing leads, projects, and media.
 */

import { Hono } from 'hono';
import { eq, sql, count } from 'drizzle-orm';
import { createDb, schema } from '../_shared/db';
import { 
  type Env,
  requireAuth, 
  getCurrentUser, 
  verifyPassword, 
  createToken, 
  setAuthCookie, 
  clearAuthCookie,
  isRateLimited,
  recordFailedAttempt,
  clearFailedAttempts
} from '../_shared/auth';

const { leads, projects, analyticsSessions, analyticsEvents } = schema;

const app = new Hono<{ Bindings: Env }>();

// =============================================================================
// ADMIN SHELL COMPONENT
// =============================================================================

const AdminShell = ({ 
  title, 
  currentPath = '/admin',
  children 
}: { 
  title: string; 
  currentPath?: string;
  children: any;
}) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <title>{title} | Exterior Group Admin</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@2.0.4" defer></script>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #111827; color: #f9fafb; min-height: 100vh; }
        .admin-layout { display: flex; min-height: 100vh; }
        .sidebar { width: 240px; background: #1f2937; border-right: 1px solid #374151; position: fixed; height: 100vh; }
        .main { margin-left: 240px; flex: 1; min-height: 100vh; }
        .header { background: #1f2937; border-bottom: 1px solid #374151; padding: 1rem 1.5rem; position: sticky; top: 0; }
        .content { padding: 1.5rem; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; color: #9ca3af; text-decoration: none; border-radius: 0.5rem; margin: 0.25rem 0.5rem; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #f9fafb; }
        .nav-item.active { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .card { background: #1f2937; border: 1px solid #374151; border-radius: 0.75rem; padding: 1.5rem; }
        .stat-card { background: #1f2937; border: 1px solid #374151; border-radius: 0.75rem; padding: 1.5rem; }
        .stat-value { font-size: 2rem; font-weight: 700; color: #f59e0b; }
        .stat-label { font-size: 0.875rem; color: #9ca3af; margin-top: 0.25rem; }
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; border: none; text-decoration: none; }
        .btn-primary { background: #f59e0b; color: #1f2937; }
        .btn-primary:hover { background: #d97706; }
        .btn-secondary { background: #374151; color: #f9fafb; }
        .btn-secondary:hover { background: #4b5563; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 0.75rem 1rem; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #374151; }
        td { padding: 0.75rem 1rem; border-bottom: 1px solid #374151; font-size: 0.875rem; }
        tr:hover td { background: rgba(55,65,81,0.5); }
        .badge { display: inline-flex; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
        .badge-new { background: #3b82f6; color: white; }
        .badge-contacted { background: #8b5cf6; color: white; }
        .badge-quoted { background: #f59e0b; color: #1f2937; }
        .badge-won { background: #10b981; color: white; }
        .badge-lost { background: #6b7280; color: white; }
      `}</style>
    </head>
    <body>
      <div class="admin-layout">
        <aside class="sidebar">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151' }}>
            <a href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                Exterior<span style={{ color: '#f59e0b' }}>Group</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Admin Panel</div>
            </a>
          </div>
          <nav style={{ padding: '1rem 0' }}>
            <a href="/admin" class={`nav-item ${currentPath === '/admin' ? 'active' : ''}`}>
              📊 Dashboard
            </a>
            <a href="/admin/leads" class={`nav-item ${currentPath?.startsWith('/admin/leads') ? 'active' : ''}`}>
              📋 Leads
            </a>
            <a href="/admin/projects" class={`nav-item ${currentPath?.startsWith('/admin/projects') ? 'active' : ''}`}>
              🏗️ Projects
            </a>
            <a href="/admin/media" class={`nav-item ${currentPath?.startsWith('/admin/media') ? 'active' : ''}`}>
              🖼️ Media
            </a>
          </nav>
          <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '1rem', borderTop: '1px solid #374151' }}>
            <a href="/admin/logout" class="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Logout
            </a>
          </div>
        </aside>
        <main class="main">
          <header class="header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h1>
              <a href="/" target="_blank" class="btn btn-secondary">View Site ↗</a>
            </div>
          </header>
          <div class="content">
            {children}
          </div>
        </main>
      </div>
    </body>
  </html>
);

// =============================================================================
// LOGIN PAGE
// =============================================================================

const LoginPage = ({ error, locked }: { error?: string; locked?: boolean }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <title>Admin Login | Exterior Group</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .login-card { width: 100%; max-width: 400px; background: #1f2937; border: 1px solid #374151; border-radius: 1rem; padding: 2rem; }
        .logo { text-align: center; margin-bottom: 2rem; }
        .logo h1 { font-size: 1.5rem; color: #f9fafb; }
        .logo span { color: #f59e0b; }
        .form-group { margin-bottom: 1.25rem; }
        .form-label { display: block; font-size: 0.875rem; color: #d1d5db; margin-bottom: 0.5rem; }
        .form-input { width: 100%; padding: 0.875rem 1rem; background: #374151; border: 1px solid #4b5563; border-radius: 0.5rem; color: #f9fafb; font-size: 1rem; }
        .form-input:focus { outline: none; border-color: #f59e0b; }
        .btn-login { width: 100%; padding: 0.875rem; background: #f59e0b; color: #1f2937; font-weight: 600; border: none; border-radius: 0.5rem; cursor: pointer; }
        .btn-login:hover { background: #d97706; }
        .btn-login:disabled { background: #4b5563; cursor: not-allowed; }
        .error { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fca5a5; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1.25rem; font-size: 0.875rem; }
      `}</style>
    </head>
    <body>
      <div class="login-card">
        <div class="logo">
          <h1>Exterior<span>Group</span></h1>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Admin Portal</p>
        </div>
        
        {error && <div class="error">{error}</div>}
        {locked && <div class="error">Too many failed attempts. Try again in 15 minutes.</div>}
        
        <form method="post" action="/admin/login">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-input" required disabled={locked} />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-input" required disabled={locked} />
          </div>
          <button type="submit" class="btn-login" disabled={locked}>
            {locked ? 'Account Locked' : 'Sign In'}
          </button>
        </form>
        
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to website
        </a>
      </div>
    </body>
  </html>
);

// =============================================================================
// AUTH ROUTES
// =============================================================================

// Login page
app.get('/login', async (c) => {
  const user = await getCurrentUser(c);
  if (user) return c.redirect('/admin');
  return c.html(<LoginPage />);
});

// Login handler
app.post('/login', async (c) => {
  const db = createDb(c.env.DB);
  const clientIp = c.req.header('CF-Connecting-IP') || 'unknown';
  
  if (await isRateLimited(db, clientIp)) {
    return c.html(<LoginPage locked={true} />);
  }
  
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  
  if (!username || !password) {
    return c.html(<LoginPage error="Please enter username and password" />);
  }
  
  if (username !== 'admin') {
    await recordFailedAttempt(db, clientIp);
    return c.html(<LoginPage error="Invalid credentials" />);
  }
  
  const passwordHash = c.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    return c.html(<LoginPage error="Authentication not configured" />);
  }
  
  if (!(await verifyPassword(password, passwordHash))) {
    await recordFailedAttempt(db, clientIp);
    return c.html(<LoginPage error="Invalid credentials" />);
  }
  
  await clearFailedAttempts(db, clientIp);
  
  const token = await createToken({ sub: 'admin', role: 'administrator' }, c.env.JWT_SECRET!);
  setAuthCookie(c, token);
  
  return c.redirect('/admin');
});

// Logout
app.get('/logout', (c) => {
  clearAuthCookie(c);
  return c.redirect('/admin/login');
});

// =============================================================================
// DASHBOARD
// =============================================================================

app.get('/', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  
  const [totalLeads] = await db.select({ count: count() }).from(leads);
  const [newLeads] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
  const [totalProjects] = await db.select({ count: count() }).from(projects);
  const [publishedProjects] = await db.select({ count: count() }).from(projects).where(eq(projects.published, true));
  
  const recentLeads = await db.select()
    .from(leads)
    .orderBy(sql`${leads.createdAt} DESC`)
    .limit(5);
  
  return c.html(
    <AdminShell title="Dashboard" currentPath="/admin">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div class="stat-card">
          <div class="stat-value">{newLeads?.count || 0}</div>
          <div class="stat-label">New Leads</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{totalLeads?.count || 0}</div>
          <div class="stat-label">Total Leads</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{publishedProjects?.count || 0}</div>
          <div class="stat-label">Published Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{totalProjects?.count || 0}</div>
          <div class="stat-label">Total Projects</div>
        </div>
      </div>
      
      <div class="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Leads</h2>
          <a href="/admin/leads" class="btn btn-secondary">View All</a>
        </div>
        
        {recentLeads.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No leads yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>{lead.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.email}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.serviceType}</td>
                  <td><span class={`badge badge-${lead.status}`}>{lead.status}</span></td>
                  <td style={{ color: '#9ca3af' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
});

// =============================================================================
// LEADS
// =============================================================================

app.get('/leads', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const status = c.req.query('status');
  
  let leadsList;
  if (status) {
    leadsList = await db.select().from(leads).where(eq(leads.status, status)).orderBy(sql`${leads.createdAt} DESC`);
  } else {
    leadsList = await db.select().from(leads).orderBy(sql`${leads.createdAt} DESC`);
  }
  
  return c.html(
    <AdminShell title="Leads" currentPath="/admin/leads">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <a href="/admin/leads" class={`btn ${!status ? 'btn-primary' : 'btn-secondary'}`}>All</a>
        <a href="/admin/leads?status=new" class={`btn ${status === 'new' ? 'btn-primary' : 'btn-secondary'}`}>New</a>
        <a href="/admin/leads?status=contacted" class={`btn ${status === 'contacted' ? 'btn-primary' : 'btn-secondary'}`}>Contacted</a>
        <a href="/admin/leads?status=quoted" class={`btn ${status === 'quoted' ? 'btn-primary' : 'btn-secondary'}`}>Quoted</a>
        <a href="/admin/leads?status=won" class={`btn ${status === 'won' ? 'btn-primary' : 'btn-secondary'}`}>Won</a>
        <a href="/admin/leads?status=lost" class={`btn ${status === 'lost' ? 'btn-primary' : 'btn-secondary'}`}>Lost</a>
      </div>
      
      <div class="card">
        {leadsList.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No leads found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Service</th>
                <th>Sector</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadsList.map(lead => (
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>{lead.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.email}</div>
                    {lead.phone && <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.phone}</div>}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.serviceType}</td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.sector}</td>
                  <td><span class={`badge badge-${lead.status}`}>{lead.status}</span></td>
                  <td style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-AU')}
                  </td>
                  <td>
                    <a href={`/admin/leads/${lead.id}`} class="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
});

// Lead detail
app.get('/leads/:id', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const id = parseInt(c.req.param('id'));
  
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) return c.redirect('/admin/leads');
  
  return c.html(
    <AdminShell title={`Lead: ${lead.name}`} currentPath="/admin/leads">
      <a href="/admin/leads" style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem', display: 'block' }}>← Back to Leads</a>
      
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        <div class="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Info</h2>
          <dl style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <dt style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Name</dt>
              <dd style={{ fontWeight: 500 }}>{lead.name}</dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Email</dt>
              <dd><a href={`mailto:${lead.email}`} style={{ color: '#f59e0b' }}>{lead.email}</a></dd>
            </div>
            {lead.phone && (
              <div>
                <dt style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Phone</dt>
                <dd><a href={`tel:${lead.phone}`} style={{ color: '#f59e0b' }}>{lead.phone}</a></dd>
              </div>
            )}
            {lead.company && (
              <div>
                <dt style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Company</dt>
                <dd>{lead.company}</dd>
              </div>
            )}
          </dl>
        </div>
        
        <div class="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Update Status</h2>
          <form method="post" action={`/admin/leads/${lead.id}/status`}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>Status</label>
              <select name="status" style={{ width: '100%', padding: '0.75rem', background: '#374151', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#f9fafb' }}>
                <option value="new" selected={lead.status === 'new'}>New</option>
                <option value="contacted" selected={lead.status === 'contacted'}>Contacted</option>
                <option value="quoted" selected={lead.status === 'quoted'}>Quoted</option>
                <option value="won" selected={lead.status === 'won'}>Won</option>
                <option value="lost" selected={lead.status === 'lost'}>Lost</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.5rem' }}>Notes</label>
              <textarea name="notes" rows={4} style={{ width: '100%', padding: '0.75rem', background: '#374151', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#f9fafb', resize: 'vertical' }}>{lead.internalNotes || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update</button>
          </form>
        </div>
        
        {lead.message && (
          <div class="card" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Message</h2>
            <p style={{ whiteSpace: 'pre-wrap', color: '#d1d5db' }}>{lead.message}</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
});

// Update lead status
app.post('/leads/:id/status', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const id = parseInt(c.req.param('id'));
  const formData = await c.req.formData();
  
  await db.update(leads)
    .set({
      status: formData.get('status') as string,
      internalNotes: formData.get('notes') as string || null,
      updatedAt: sql`datetime('now')`,
    })
    .where(eq(leads.id, id));
  
  return c.redirect(`/admin/leads/${id}`);
});

// =============================================================================
// PROJECTS
// =============================================================================

app.get('/projects', requireAuth, async (c) => {
  const db = createDb(c.env.DB);
  const projectList = await db.select().from(projects).orderBy(sql`${projects.createdAt} DESC`);
  
  return c.html(
    <AdminShell title="Projects" currentPath="/admin/projects">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ color: '#9ca3af' }}>{projectList.length} projects</p>
        <a href="/admin/projects/new" class="btn btn-primary">+ Add Project</a>
      </div>
      
      <div class="card">
        {projectList.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No projects yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map(project => (
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>{project.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{project.location}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{project.category}</td>
                  <td>
                    <span class={`badge ${project.published ? 'badge-won' : 'badge-lost'}`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/admin/projects/${project.id}/edit`} class="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
});

// =============================================================================
// MEDIA
// =============================================================================

app.get('/media', requireAuth, async (c) => {
  const prefix = c.req.query('prefix');
  const listResult = await c.env.R2_BUCKET.list({ prefix: prefix || undefined, limit: 100 });
  
  return c.html(
    <AdminShell title="Media Library" currentPath="/admin/media">
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <a href="/admin/media" class={`btn ${!prefix ? 'btn-primary' : 'btn-secondary'}`}>All</a>
        <a href="/admin/media?prefix=projects" class={`btn ${prefix === 'projects' ? 'btn-primary' : 'btn-secondary'}`}>Projects</a>
        <a href="/admin/media?prefix=uploads" class={`btn ${prefix === 'uploads' ? 'btn-primary' : 'btn-secondary'}`}>Uploads</a>
      </div>
      
      <div class="card">
        {listResult.objects.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No files found</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {listResult.objects.map(obj => (
              <div style={{ background: '#374151', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {obj.httpMetadata?.contentType?.startsWith('image/') ? (
                    <img src={`/api/assets/${obj.key}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>📄</span>
                  )}
                </div>
                <div style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={obj.key}>
                    {obj.key.split('/').pop()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
});

export default app;
