/**
 * Admin Shell Component
 * 
 * Main layout wrapper for all admin pages.
 * Provides sidebar navigation and consistent branding.
 */

import type { FC, PropsWithChildren } from 'hono/jsx';

interface AdminShellProps {
  title: string;
  currentPath?: string;
  user?: { sub: string; role: string };
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Leads', href: '/admin/leads', icon: '📋' },
  { label: 'Projects', href: '/admin/projects', icon: '🏗️' },
  { label: 'Media', href: '/admin/media', icon: '🖼️' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
];

/** Sidebar Navigation Item */
const NavLink: FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => (
  <a
    href={item.href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      color: isActive ? '#f59e0b' : '#9ca3af',
      background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
      fontWeight: isActive ? 600 : 400,
      transition: 'all 0.2s',
    }}
  >
    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
    <span>{item.label}</span>
  </a>
);

/** Admin Shell Layout */
export const AdminShell: FC<PropsWithChildren<AdminShellProps>> = ({ 
  title, 
  currentPath = '/admin',
  user,
  children 
}) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="noindex, nofollow" />
      <title>{title} | Exterior Group Admin</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@2.0.0" defer></script>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #111827;
          color: #f9fafb;
          min-height: 100vh;
        }
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }
        .admin-sidebar {
          width: 260px;
          background: #1f2937;
          border-right: 1px solid #374151;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
        }
        .admin-header {
          background: #1f2937;
          border-bottom: 1px solid #374151;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .admin-content {
          padding: 1.5rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .btn-primary {
          background: #f59e0b;
          color: #1f2937;
        }
        .btn-primary:hover {
          background: #d97706;
        }
        .btn-secondary {
          background: #374151;
          color: #f9fafb;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
        .btn-danger {
          background: #dc2626;
          color: white;
        }
        .btn-danger:hover {
          background: #b91c1c;
        }
        .card {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        .stat-card {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #f59e0b;
        }
        .stat-label {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          border-bottom: 1px solid #374151;
        }
        td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #374151;
          font-size: 0.875rem;
        }
        tr:hover td {
          background: rgba(55, 65, 81, 0.5);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .badge-new { background: #3b82f6; color: white; }
        .badge-contacted { background: #8b5cf6; color: white; }
        .badge-quoted { background: #f59e0b; color: #1f2937; }
        .badge-won { background: #10b981; color: white; }
        .badge-lost { background: #6b7280; color: white; }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          color: #f9fafb;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #f59e0b;
        }
        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5rem;
          padding-right: 2.5rem;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-main {
            margin-left: 0;
          }
        }
      `}</style>
    </head>
    <body>
      <div class="admin-layout">
        {/* Sidebar */}
        <aside class="admin-sidebar">
          {/* Logo */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151' }}>
            <a href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: '#f59e0b',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#1f2937'
                }}>
                  EG
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Exterior Group</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Admin Panel</div>
                </div>
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav style={{ padding: '1rem', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navItems.map(item => (
                <NavLink 
                  item={item} 
                  isActive={currentPath === item.href || (item.href !== '/admin' && currentPath?.startsWith(item.href))} 
                />
              ))}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.sub || 'Admin'}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{user?.role || 'administrator'}</div>
              </div>
              <a
                href="/admin/logout"
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  background: '#374151',
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
                title="Logout"
              >
                ↪️
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main class="admin-main">
          {/* Header */}
          <header class="admin-header">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="/" target="_blank" class="btn btn-secondary">
                View Site ↗
              </a>
            </div>
          </header>

          {/* Page Content */}
          <div class="admin-content">
            {children}
          </div>
        </main>
      </div>
    </body>
  </html>
);

export default AdminShell;
