# Story 3.2: HDA Category Filtering (HTMX)

Status: ready-for-dev

## Story

As a visitor,
I want to filter the project gallery by service type without a full page reload,
so that my discovery experience feels app-like and immediate.

## Acceptance Criteria

1. **Given** HTMX is loaded in the layout
2. **When** I select a category filter (e.g., 'Roofing')
3. **Then** HTMX performs an `hx-get` to `/api/fragments/gallery?category=roofing`
4. **And** the grid items are swapped in-place within 200ms.

## Tasks / Subtasks

- [ ] Implement `CategoryFilter` component with HTMX attributes (AC: 1, 2)
- [ ] Create fragment route `functions/api/fragments/gallery.tsx` (AC: 3)
  - [ ] Support `category` query parameter
  - [ ] Return only the `ProofCard` fragments (no layout)
- [ ] Implement swap animation/transition for gallery filtering (AC: 4)

## Dev Notes

- **HDA Pattern**: Return HTML fragments, not JSON [Source: architecture.md#API & Communication Patterns]
- **Performance**: Response must be under 200ms [Source: epics.md#Story 3.2]

### Project Structure Notes

- Fragment route in `functions/api/fragments/gallery.tsx`

### References

- [Source: epics.md#Story 3.2]
- [Source: architecture.md#HDA Pattern]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
