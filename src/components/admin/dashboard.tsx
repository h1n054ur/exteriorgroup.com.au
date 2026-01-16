/**
 * Admin Dashboard Components
 * 
 * Dashboard overview with key metrics and recent activity.
 */

import type { FC } from 'hono/jsx';
import type { Lead, Project } from '../../../db/schema';

interface DashboardProps {
  stats: {
    totalLeads: number;
    newLeads: number;
    totalProjects: number;
    publishedProjects: number;
  };
  recentLeads: Lead[];
  recentProjects: Project[];
}

/** Stat Card Component */
const StatCard: FC<{ value: number | string; label: string; trend?: string; trendUp?: boolean }> = ({ 
  value, 
  label, 
  trend,
  trendUp 
}) => (
  <div class="stat-card">
    <div class="stat-value">{value}</div>
    <div class="stat-label">{label}</div>
    {trend && (
      <div style={{ 
        fontSize: '0.75rem', 
        marginTop: '0.5rem',
        color: trendUp ? '#10b981' : '#ef4444'
      }}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    )}
  </div>
);

/** Status Badge */
const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const badgeClass = `badge badge-${status}`;
  return <span class={badgeClass}>{status}</span>;
};

/** Dashboard Content */
export const DashboardContent: FC<DashboardProps> = ({ stats, recentLeads, recentProjects }) => (
  <div>
    {/* Stats Grid */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <StatCard value={stats.newLeads} label="New Leads" trend="this week" trendUp />
      <StatCard value={stats.totalLeads} label="Total Leads" />
      <StatCard value={stats.publishedProjects} label="Published Projects" />
      <StatCard value={stats.totalProjects} label="Total Projects" />
    </div>

    {/* Two Column Layout */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '1.5rem' 
    }}>
      {/* Recent Leads */}
      <div class="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Leads</h2>
          <a href="/admin/leads" class="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
            View All
          </a>
        </div>
        
        {recentLeads.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No leads yet. They'll appear here when customers submit inquiries.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.slice(0, 5).map(lead => (
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>{lead.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.email}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.serviceType}</td>
                  <td><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Projects */}
      <div class="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Projects</h2>
          <a href="/admin/projects" class="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
            View All
          </a>
        </div>
        
        {recentProjects.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No projects yet. Add your first project to showcase your work.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.slice(0, 5).map(project => (
                <tr>
                  <td>
                    <div style={{ fontWeight: 500 }}>{project.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{project.location}</div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{project.category}</td>
                  <td>
                    <span class={`badge ${project.published ? 'badge-won' : 'badge-contacted'}`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Quick Actions */}
    <div class="card" style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a href="/admin/projects/new" class="btn btn-primary">
          + Add Project
        </a>
        <a href="/admin/leads?status=new" class="btn btn-secondary">
          Review New Leads ({stats.newLeads})
        </a>
        <a href="/admin/media" class="btn btn-secondary">
          Upload Media
        </a>
      </div>
    </div>
  </div>
);

export default DashboardContent;
