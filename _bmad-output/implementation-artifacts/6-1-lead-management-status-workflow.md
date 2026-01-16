# Story 6.1: Lead Management & Status Workflow

Status: ready-for-dev

## Story

As David,
I want to view a list of all inquiries and update their status,
so that I can track the progress of my commercial pipeline.

## Acceptance Criteria

1. **Given** the Admin Lead dashboard
2. **When** I update a lead status (e.g., to 'Contacted')
3. **Then** the change is persisted to D1 via an inline HTMX update
4. **And** a "Saved" visual feedback fragment appears instantly.

## Tasks / Subtasks

- [ ] Create `LeadList` admin fragment in `functions/admin/leads.tsx` (AC: 1)
- [ ] Implement inline status dropdown with `hx-post` update (AC: 2, 3)
- [ ] Create status update handler in `functions/api/leads/status.ts` (AC: 3)
- [ ] Implement "Saved" toast/feedback fragment (AC: 4)

## Dev Notes

- **Admin Logic**: Functional parity with Borderless-Tech dashboard [Source: epics.md#Additional Requirements]
- **HTMX**: Inline update with instant visual feedback [Source: epics.md#Story 6.1]

### Project Structure Notes

- Admin leads logic in `functions/admin/leads.tsx`

### References

- [Source: epics.md#Story 6.1]
- [Source: db/schema.ts#leads]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
