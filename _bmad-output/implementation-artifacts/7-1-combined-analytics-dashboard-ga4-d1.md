# Story 7.1: Combined Analytics Dashboard (GA4 + D1)

Status: ready-for-dev

## Story

As David,
I want to see a combined view of my site traffic and lead conversion rates,
so that I can understand which services are driving the most business.

## Acceptance Criteria

1. **Given** the Admin Analytics tab
2. **When** I load the dashboard
3. **Then** data is fetched from the Cloudflare Analytics API and local D1 event logs
4. **And** the results are presented in standardized Borderless-Tech viz cards.

## Tasks / Subtasks

- [ ] Create `AnalyticsDashboard` admin fragment in `functions/admin/analytics.tsx` (AC: 1)
- [ ] Implement server-side aggregation of D1 `analytics_events` (AC: 3)
- [ ] (Optional) Integrate GA4 Measurement Protocol data if available (AC: 3)
- [ ] Render data in Borderless-Tech style visualization cards (AC: 4)

## Dev Notes

- **Telemetry**: Converge GA4 and custom D1 event logging [Source: epics.md#Epic 7]
- **Pattern**: Standardized Borderless-Tech viz cards [Source: epics.md#Story 7.1]

### Project Structure Notes

- Analytics logic in `functions/admin/analytics.tsx`

### References

- [Source: epics.md#Story 7.1]
- [Source: db/schema.ts#analytics_events]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
