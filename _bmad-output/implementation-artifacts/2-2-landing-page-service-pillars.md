# Story 2.2: Landing Page Service Pillars

Status: ready-for-dev

## Story

As a property manager,
I want to see the core service pillars (Roofing, Painting, Strata) immediately on the home page,
so that I can quickly self-select the relevant proof category.

## Acceptance Criteria

1. **Given** the "Edge-Native Hybrid" design direction
2. **When** I land on the home page
3. **Then** the 3 primary service pillars are prominently displayed with "Safety Amber" triggers
4. **And** the layout meets the LCP < 1.2s target on mobile.

## Tasks / Subtasks

- [ ] Design and implement the Hero section with "Safety Amber" triggers (AC: 1, 3)
- [ ] Implement Service Pillar cards for Roofing, Painting, and Strata (AC: 3)
  - [ ] Optimize images via R2 proxy for speed
- [ ] Ensure mobile-first responsive layout for service pillars (AC: 4)
- [ ] Verify LCP < 1.2s on mobile (NFR2) (AC: 4)

## Dev Notes

- **Design Trigger**: "Safety Amber" highlights for calls to action [Source: ux-design-specification.md]
- **Performance**: Must meet NFR2 (LCP < 1.2s) [Source: epics.md#NonFunctional Requirements]
- **Assets**: All images must be served via `/api/assets/` proxy [Source: architecture.md#API Boundaries]

### Project Structure Notes

- Home page components in `src/components/ui/` or a new `src/components/home/` folder.

### References

- [Source: epics.md#Story 2.2]
- [Source: prd.md#NFR2]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
