# Story 2.1: Base Hono Layout & Responsive Navigation

Status: ready-for-dev

## Story

As a visitor,
I want a consistent site shell with a persistent Montserrat-based navigation,
so that I can easily move between services on any device.

## Acceptance Criteria

1. **Given** the Hono JSX renderer
2. **When** I load any public route
3. **Then** the Montserrat headings and Inter UI typography are applied correctly
4. **And** the navigation bar is responsive across mobile, tablet, and desktop breakpoints.

## Tasks / Subtasks

- [ ] Create base layout component in `src/layout.tsx` (AC: 1, 3)
  - [ ] Implement HTML document shell with Montserrat and Inter font imports
  - [ ] Configure Tailwind for font families
- [ ] Implement responsive navigation component (AC: 4)
  - [ ] Mobile hamburger menu with HTMX/Alpine or pure Tailwind
  - [ ] Desktop horizontal links for Commercial, Residential, Roofing, Painting
- [ ] Update `src/index.tsx` to use the base layout for all public routes (AC: 2)

## Dev Notes

- **Typography**: Inter (UI) + Montserrat (Headings) [Source: epics.md#Additional Requirements]
- **Framework**: Hono JSX [Source: architecture.md#Frontend Architecture]
- **Interactivity**: HTMX v2 for mobile menu toggle if needed [Source: architecture.md#Frontend Architecture]
- **Styling**: Tailwind CSS [Source: architecture.md#Frontend Architecture]

### Project Structure Notes

- Layout should be in `src/layout.tsx`
- Nav components in `src/components/ui/`

### References

- [Source: epics.md#Story 2.1]
- [Source: architecture.md#Frontend Architecture]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
