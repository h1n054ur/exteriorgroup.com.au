# Story 3.4: Before/After Interactive Slider

Status: ready-for-dev

## Story

As a visitor,
I want to compare restoration progress using an interactive slider,
so that I can visually validate the transformation quality.

## Acceptance Criteria

1. **Given** a project with 'before' and 'after' images
2. **When** I drag the slider handle on a Proof Card or Detail fragment
3. **Then** the images are revealed proportionally to the handle position
4. **And** the interaction is touch-optimized for mobile.

## Tasks / Subtasks

- [ ] Create `BeforeAfterSlider` component in `src/components/proof/before-after-slider.tsx` (AC: 3, 4)
  - [ ] Implement with pure CSS or minimal JS inline
- [ ] Integrate slider into `ProofCard` and project detail fragments (AC: 2)
- [ ] Ensure responsive sizing for the slider (AC: 4)

## Dev Notes

- **Interaction**: "Instant Proof Match" via edge-filtered hypermedia [Source: epics.md#Additional Requirements]
- **UX**: Slider must be touch-optimized [Source: epics.md#Story 3.4]

### Project Structure Notes

- Component in `src/components/proof/`

### References

- [Source: epics.md#Story 3.4]
- [Source: ux-design-specification.md]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
