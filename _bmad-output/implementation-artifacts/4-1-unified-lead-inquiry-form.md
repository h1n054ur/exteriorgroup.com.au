# Story 4.1: Unified Lead Inquiry Form

Status: ready-for-dev

## Story

As a potential client,
I want a simple, conversational inquiry form that works perfectly on my phone,
so that I can request a quote with minimal friction.

## Acceptance Criteria

1. **Given** the "Safety Amber" design triggers
2. **When** I open the inquiry form
3. **Then** the form utilizes floating labels and contextual help text
4. **And** the submission button is prominently styled in Amber.

## Tasks / Subtasks

- [ ] Create `LeadForm` component in `src/components/forms/lead-form.tsx` (AC: 3)
  - [ ] Implement floating labels with Tailwind
- [ ] Implement "Safety Amber" styled submit button (AC: 4)
- [ ] Ensure form fields map to the `leads` table in Drizzle (AC: 2)

## Dev Notes

- **Design**: "Safety Amber" triggers [Source: epics.md#Story 4.1]
- **Schema**: Maps to `leads` table in `db/schema.ts` [Source: architecture.md#Feature Mapping]

### Project Structure Notes

- Component in `src/components/forms/`

### References

- [Source: epics.md#Story 4.1]
- [Source: db/schema.ts]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
