# Story 3.1: Project Proof Gallery Masonry Grid

Status: ready-for-dev

## Story

As a visitor,
I want to view a gallery of completed projects in a clean masonry layout,
so that I can quickly scan the quality of work through high-impact visuals.

## Acceptance Criteria

1. **Given** a set of project data in D1
2. **When** I navigate to the gallery
3. **Then** projects are displayed in a Tailwind-based masonry grid
4. **And** each card uses skeleton loaders while R2 images are fetching.

## Tasks / Subtasks

- [ ] Create `ProofCard` component in `src/components/proof/proof-card.tsx` (AC: 3, 4)
  - [ ] Implement skeleton loader using Tailwind `animate-pulse`
- [ ] Create `ProofGallery` component in `src/components/proof/proof-gallery.tsx` (AC: 3)
  - [ ] Implement CSS columns or grid-based masonry layout
- [ ] Create `/gallery` route in `src/index.tsx` fetching data from D1 (AC: 1, 2)

## Dev Notes

- **Database**: Use Drizzle Relational Query API for projects [Source: architecture.md#Enforcement Guidelines]
- **Loading Pattern**: Preferred skeleton loaders over spinners [Source: architecture.md#Loading State Patterns]

### Project Structure Notes

- Components go in `src/components/proof/`

### References

- [Source: epics.md#Story 3.1]
- [Source: architecture.md#Data Architecture]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
