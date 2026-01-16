# Story 3.3: Project Detail Fragment Slide-overs

Status: ready-for-dev

## Story

As a strata manager,
I want to view deep project details in a slide-over fragment,
so that I can see technical challenges solved without losing my place in the gallery.

## Acceptance Criteria

1. **Given** a selected Proof Card
2. **When** I tap 'View Proof'
3. **Then** an `hx-target` fragment loads the project details into a slide-over container
4. **And** the detail fragment includes high-res media and Markdown descriptions.

## Tasks / Subtasks

- [ ] Implement `SlideOver` shell component in `src/components/ui/` (AC: 3)
- [ ] Create fragment route `functions/api/fragments/project-detail.tsx` (AC: 3, 4)
  - [ ] Fetch project by slug from D1
  - [ ] Render Markdown description using `marked`
- [ ] Update `ProofCard` to trigger the slide-over via HTMX (AC: 2)

## Dev Notes

- **Markdown**: Use `marked` library for content rendering [Source: package.json]
- **Interactivity**: Use `hx-target` to load into a fixed container [Source: epics.md#Story 3.3]

### Project Structure Notes

- Fragment route in `functions/api/fragments/project-detail.tsx`

### References

- [Source: epics.md#Story 3.3]
- [Source: architecture.md#Fragment Contracts]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
