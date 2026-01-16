# Story 4.2: Real-time HTMX Field Validation

Status: ready-for-dev

## Story

As a user in a hurry,
I want to see immediate feedback if I've entered incorrect information,
so that I can fix errors before attempting to submit.

## Acceptance Criteria

1. **Given** a lead capture form
2. **When** I blur an input field (e.g., email or phone)
3. **Then** HTMX triggers a server-side validation check
4. **And** inline error fragments appear instantly if validation fails.

## Tasks / Subtasks

- [ ] Implement `hx-post` validation triggers on form inputs (AC: 2, 3)
- [ ] Create validation endpoint `functions/api/leads/validate.tsx` (AC: 3)
  - [ ] Use Zod for field validation
  - [ ] Return HTML `<p class="text-red-500">` fragments for errors
- [ ] Update `LeadForm` to handle `hx-target` for error displays (AC: 4)

## Dev Notes

- **Validation**: Use Zod for incoming request validation [Source: architecture.md#Enforcement Guidelines]
- **HDA**: HTMX `hx-post` for validation returns individual fragments [Source: architecture.md#Error Handling Patterns]

### Project Structure Notes

- Validation logic in `functions/api/leads/validate.tsx`

### References

- [Source: epics.md#Story 4.2]
- [Source: architecture.md#API Naming Conventions]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
