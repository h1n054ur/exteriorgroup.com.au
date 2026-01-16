import { describe, it, expect } from 'vitest';
import app from '../../src/index';

interface HealthResponse {
  status: string;
  timestamp: string;
  runtime: string;
}

describe('Health Check API', () => {
  it('should return status ok', async () => {
    const res = await app.request('/api/health', {}, {
      DB: {} as D1Database,
      R2_BUCKET: {} as R2Bucket,
      SITE_NAME: 'Test Site',
    });
    
    expect(res.status).toBe(200);
    
    const json = await res.json() as HealthResponse;
    expect(json.status).toBe('ok');
    expect(json.runtime).toBe('cloudflare-workers');
  });
});

describe('Landing Page', () => {
  it('should return HTML with site name', async () => {
    const res = await app.request('/', {}, {
      DB: {} as D1Database,
      R2_BUCKET: {} as R2Bucket,
      SITE_NAME: 'Exterior Group',
    });
    
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/html');
    
    const html = await res.text();
    expect(html).toContain('Exterior Group');
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await app.request('/unknown-page', {}, {
      DB: {} as D1Database,
      R2_BUCKET: {} as R2Bucket,
      SITE_NAME: 'Test Site',
    });
    
    expect(res.status).toBe(404);
    expect(await res.text()).toContain('Page Not Found');
  });
});
