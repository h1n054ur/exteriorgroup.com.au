/**
 * Analytics Dashboard Components
 * 
 * Combined analytics dashboard showing:
 * - Lead conversion metrics
 * - Traffic sources
 * - Page views (from D1 analytics_events)
 * - Custom event tracking
 */

import type { FC } from 'hono/jsx';

interface AnalyticsStats {
  totalPageViews: number;
  uniqueSessions: number;
  totalLeads: number;
  conversionRate: number;
  avgTimeOnPage: number;
}

interface TrafficSource {
  source: string;
  sessions: number;
  leads: number;
  percentage: number;
}

interface PopularPage {
  pageUrl: string;
  views: number;
  avgTime: number;
}

interface LeadsByService {
  service: string;
  count: number;
  percentage: number;
}

interface LeadsByStatus {
  status: string;
  count: number;
  percentage: number;
}

interface AnalyticsProps {
  stats: AnalyticsStats;
  trafficSources: TrafficSource[];
  popularPages: PopularPage[];
  leadsByService: LeadsByService[];
  leadsByStatus: LeadsByStatus[];
  recentEvents: { eventType: string; pageUrl: string; timestamp: string }[];
}

/** Stat Card */
const StatCard: FC<{ value: string | number; label: string; change?: string; up?: boolean }> = ({ 
  value, 
  label, 
  change,
  up 
}) => (
  <div class="stat-card">
    <div class="stat-value">{value}</div>
    <div class="stat-label">{label}</div>
    {change && (
      <div style={{ 
        fontSize: '0.75rem', 
        marginTop: '0.5rem',
        color: up ? '#10b981' : '#ef4444'
      }}>
        {up ? '↑' : '↓'} {change}
      </div>
    )}
  </div>
);

/** Progress Bar */
const ProgressBar: FC<{ percentage: number; color?: string }> = ({ percentage, color = '#f59e0b' }) => (
  <div style={{ 
    width: '100%', 
    height: '0.5rem', 
    background: '#374151', 
    borderRadius: '0.25rem',
    overflow: 'hidden'
  }}>
    <div style={{ 
      width: `${Math.min(100, percentage)}%`, 
      height: '100%', 
      background: color,
      transition: 'width 0.3s'
    }} />
  </div>
);

/** Analytics Dashboard Content */
export const AnalyticsContent: FC<AnalyticsProps> = ({ 
  stats, 
  trafficSources, 
  popularPages,
  leadsByService,
  leadsByStatus,
  recentEvents
}) => (
  <div>
    {/* Key Metrics */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <StatCard value={stats.totalPageViews.toLocaleString()} label="Page Views" />
      <StatCard value={stats.uniqueSessions.toLocaleString()} label="Sessions" />
      <StatCard value={stats.totalLeads.toLocaleString()} label="Total Leads" />
      <StatCard 
        value={`${stats.conversionRate.toFixed(1)}%`} 
        label="Conversion Rate" 
      />
      <StatCard 
        value={`${Math.floor(stats.avgTimeOnPage / 60)}m ${stats.avgTimeOnPage % 60}s`} 
        label="Avg. Time on Page" 
      />
    </div>

    {/* Two Column Layout */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Traffic Sources */}
      <div class="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Traffic Sources</h2>
        {trafficSources.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No traffic data yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trafficSources.map(source => (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}>
                    {source.source || 'Direct'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {source.sessions} sessions • {source.leads} leads
                  </span>
                </div>
                <ProgressBar percentage={source.percentage} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Pages */}
      <div class="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Popular Pages</h2>
        {popularPages.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No page view data yet
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {popularPages.slice(0, 5).map(page => (
                <tr>
                  <td style={{ 
                    maxWidth: '200px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {page.pageUrl}
                  </td>
                  <td>{page.views}</td>
                  <td>{Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Leads Analysis */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Leads by Service */}
      <div class="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Leads by Service</h2>
        {leadsByService.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No leads yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leadsByService.map(item => (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{item.service}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.count} ({item.percentage.toFixed(0)}%)</span>
                </div>
                <ProgressBar 
                  percentage={item.percentage} 
                  color={
                    item.service === 'roofing' ? '#ef4444' : 
                    item.service === 'painting' ? '#3b82f6' : 
                    item.service === 'strata' ? '#10b981' : '#f59e0b'
                  } 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leads by Status */}
      <div class="card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Lead Pipeline</h2>
        {leadsByStatus.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            No leads yet
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {leadsByStatus.map(item => (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{item.status}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.count} ({item.percentage.toFixed(0)}%)</span>
                </div>
                <ProgressBar 
                  percentage={item.percentage} 
                  color={
                    item.status === 'new' ? '#3b82f6' : 
                    item.status === 'contacted' ? '#8b5cf6' : 
                    item.status === 'quoted' ? '#f59e0b' :
                    item.status === 'won' ? '#10b981' : '#6b7280'
                  } 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Recent Events */}
    <div class="card">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Events</h2>
      {recentEvents.length === 0 ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
          No events recorded yet. Events will appear as users interact with your site.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Page</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentEvents.slice(0, 10).map(event => (
              <tr>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.5rem',
                    background: '#374151',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {event.eventType}
                  </span>
                </td>
                <td style={{ 
                  maxWidth: '300px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '0.875rem'
                }}>
                  {event.pageUrl}
                </td>
                <td style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(event.timestamp).toLocaleString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Note about GA4 */}
    <div style={{
      marginTop: '1.5rem',
      padding: '1rem',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid #3b82f6',
      borderRadius: '0.5rem'
    }}>
      <p style={{ color: '#93c5fd', fontSize: '0.875rem' }}>
        <strong>Tip:</strong> For advanced analytics including real-time visitors, user flows, and demographic data, 
        connect Google Analytics 4. These D1-powered analytics provide essential lead and conversion tracking.
      </p>
    </div>
  </div>
);

export default AnalyticsContent;
