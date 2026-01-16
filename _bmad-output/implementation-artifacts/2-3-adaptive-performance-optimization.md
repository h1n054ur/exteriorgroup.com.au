# Story 2.3: Adaptive Performance Optimization

Status: ready-for-dev

## Story

As a mobile user on a 4G connection,
I want the site to load and respond instantly,
so that I can get the information I need without frustration.

## Acceptance Criteria

1. **Given** the Cloudflare edge runtime
2. **When** the landing page is audited via Lighthouse
3. **Then** the Performance score is > 95
4. **And** all static assets are served with optimal cache-control headers.

## Tasks / Subtasks

- [ ] Audit all public routes for NFR1/NFR2 compliance (AC: 1, 2)
- [ ] Implement aggressive caching headers for all static assets in `dist/` (AC: 4)
- [ ] Optimize R2 proxy streaming for faster TTFB (AC: 4)
- [ ] Minimize critical CSS and JS path (AC: 3)

## Dev Notes

- **Targets**: TTFB < 200ms (NFR1), LCP < 1.2s (NFR2) [Source: prd.md#NonFunctional Requirements]
- **Tools**: Lighthouse, Cloudflare Observatory [Source: epics.md#Story 2.3]

### Project Structure Notes

- Cache headers are managed in `src/index.tsx` and `src/lib/r2.ts`.

### References

- [Source: epics.md#Story 2.3]
- [Source: prd.md#NFR1, NFR2]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
