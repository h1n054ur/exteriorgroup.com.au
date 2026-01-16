/**
 * Lead Management Components
 * 
 * Admin interface for viewing and managing sales leads.
 * Supports status workflow, filtering, and inline notes.
 */

import type { FC } from 'hono/jsx';
import type { Lead } from '../../../db/schema';

interface LeadsListProps {
  leads: Lead[];
  statusFilter?: string;
  totalCount: number;
}

interface LeadDetailProps {
  lead: Lead;
}

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
const SERVICE_OPTIONS = ['general', 'roofing', 'painting', 'strata'] as const;

/** Status Badge */
const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    new: { bg: '#3b82f6', text: 'white' },
    contacted: { bg: '#8b5cf6', text: 'white' },
    quoted: { bg: '#f59e0b', text: '#1f2937' },
    won: { bg: '#10b981', text: 'white' },
    lost: { bg: '#6b7280', text: 'white' },
  };
  const style = colors[status] || colors.new;
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
      background: style.bg,
      color: style.text,
      textTransform: 'capitalize'
    }}>
      {status}
    </span>
  );
};

/** Filter Tabs */
const FilterTabs: FC<{ currentFilter?: string; counts: Record<string, number> }> = ({ currentFilter, counts }) => (
  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
    <a
      href="/admin/leads"
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        background: !currentFilter ? '#f59e0b' : '#374151',
        color: !currentFilter ? '#1f2937' : '#f9fafb',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      All ({counts.all || 0})
    </a>
    {STATUS_OPTIONS.map(status => (
      <a
        href={`/admin/leads?status=${status}`}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          background: currentFilter === status ? '#f59e0b' : '#374151',
          color: currentFilter === status ? '#1f2937' : '#f9fafb',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'capitalize'
        }}
      >
        {status} ({counts[status] || 0})
      </a>
    ))}
  </div>
);

/** Leads Table */
export const LeadsListContent: FC<LeadsListProps & { counts: Record<string, number> }> = ({ 
  leads, 
  statusFilter, 
  totalCount,
  counts 
}) => (
  <div>
    <FilterTabs currentFilter={statusFilter} counts={counts} />
    
    {leads.length === 0 ? (
      <div class="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
          {statusFilter 
            ? `No ${statusFilter} leads found.` 
            : 'No leads yet. They will appear here when customers submit inquiries.'}
        </p>
        {statusFilter && (
          <a href="/admin/leads" class="btn btn-secondary">View All Leads</a>
        )}
      </div>
    ) : (
      <div class="card" style={{ overflow: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Service</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Source</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr>
                <td>
                  <div style={{ fontWeight: 500 }}>{lead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.email}</div>
                  {lead.phone && (
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{lead.phone}</div>
                  )}
                </td>
                <td style={{ textTransform: 'capitalize' }}>{lead.serviceType}</td>
                <td style={{ textTransform: 'capitalize' }}>{lead.sector}</td>
                <td><StatusBadge status={lead.status} /></td>
                <td>
                  {lead.utmSource ? (
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {lead.utmSource}/{lead.utmMedium || 'direct'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Direct</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-AU', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                </td>
                <td>
                  <a 
                    href={`/admin/leads/${lead.id}`}
                    class="btn btn-secondary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

/** Lead Detail View */
export const LeadDetailContent: FC<LeadDetailProps> = ({ lead }) => (
  <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
    {/* Contact Info */}
    <div class="card">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Information</h2>
      <dl style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Name</dt>
          <dd style={{ fontWeight: 500 }}>{lead.name}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Email</dt>
          <dd>
            <a href={`mailto:${lead.email}`} style={{ color: '#f59e0b' }}>{lead.email}</a>
          </dd>
        </div>
        {lead.phone && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Phone</dt>
            <dd>
              <a href={`tel:${lead.phone}`} style={{ color: '#f59e0b' }}>{lead.phone}</a>
            </dd>
          </div>
        )}
        {lead.company && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Company</dt>
            <dd>{lead.company}</dd>
          </div>
        )}
      </dl>
    </div>

    {/* Inquiry Details */}
    <div class="card">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Inquiry Details</h2>
      <dl style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Service Type</dt>
          <dd style={{ textTransform: 'capitalize' }}>{lead.serviceType}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Sector</dt>
          <dd style={{ textTransform: 'capitalize' }}>{lead.sector}</dd>
        </div>
        {lead.message && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Message</dt>
            <dd style={{ whiteSpace: 'pre-wrap', background: '#374151', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
              {lead.message}
            </dd>
          </div>
        )}
      </dl>
    </div>

    {/* Status Management */}
    <div class="card">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Status Management</h2>
      <form 
        method="post" 
        action={`/admin/leads/${lead.id}/status`}
        hx-post={`/api/admin/leads/${lead.id}/status`}
        hx-swap="outerHTML"
        hx-target="closest .card"
      >
        <div class="form-group">
          <label class="form-label" for="status">Current Status</label>
          <select 
            id="status" 
            name="status" 
            class="form-input form-select"
          >
            {STATUS_OPTIONS.map(status => (
              <option value={status} selected={lead.status === status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="internalNotes">Internal Notes</label>
          <textarea 
            id="internalNotes" 
            name="internalNotes" 
            class="form-input form-textarea"
            placeholder="Add notes about this lead..."
            rows={4}
          >{lead.internalNotes || ''}</textarea>
        </div>
        
        <button type="submit" class="btn btn-primary">
          Update Lead
        </button>
      </form>
    </div>

    {/* Attribution */}
    <div class="card">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Attribution</h2>
      <dl style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Source</dt>
          <dd>{lead.utmSource || 'Direct'}</dd>
        </div>
        {lead.utmMedium && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Medium</dt>
            <dd>{lead.utmMedium}</dd>
          </div>
        )}
        {lead.utmCampaign && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Campaign</dt>
            <dd>{lead.utmCampaign}</dd>
          </div>
        )}
        {lead.landingPage && (
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Landing Page</dt>
            <dd style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>{lead.landingPage}</dd>
          </div>
        )}
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Submitted</dt>
          <dd>
            {new Date(lead.createdAt).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </dd>
        </div>
      </dl>
    </div>
  </div>
);

/** Lead Update Success Fragment */
export const LeadUpdateSuccess: FC<{ lead: Lead }> = ({ lead }) => (
  <div class="card">
    <div style={{ 
      background: 'rgba(16, 185, 129, 0.1)', 
      border: '1px solid #10b981',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      marginBottom: '1rem'
    }}>
      <p style={{ color: '#34d399', fontSize: '0.875rem' }}>Lead updated successfully!</p>
    </div>
    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Status Management</h2>
    <form 
      method="post" 
      action={`/admin/leads/${lead.id}/status`}
      hx-post={`/api/admin/leads/${lead.id}/status`}
      hx-swap="outerHTML"
      hx-target="closest .card"
    >
      <div class="form-group">
        <label class="form-label" for="status">Current Status</label>
        <select 
          id="status" 
          name="status" 
          class="form-input form-select"
        >
          {STATUS_OPTIONS.map(status => (
            <option value={status} selected={lead.status === status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label" for="internalNotes">Internal Notes</label>
        <textarea 
          id="internalNotes" 
          name="internalNotes" 
          class="form-input form-textarea"
          placeholder="Add notes about this lead..."
          rows={4}
        >{lead.internalNotes || ''}</textarea>
      </div>
      
      <button type="submit" class="btn btn-primary">
        Update Lead
      </button>
    </form>
  </div>
);

export default LeadsListContent;
