# Story 6.2: Project Showcase CRUD & Markdown Editor

Status: ready-for-dev

## Story

As David,
I want to create and edit project showcases using a Markdown editor,
so that I can publish new work without needing a developer.

## Acceptance Criteria

1. **Given** the Admin Project dashboard
2. **When** I save a new project with Markdown content
3. **Then** the content is stored in D1 and rendered correctly on the public site
4. **And** I can toggle the 'published' status instantly.

## Tasks / Subtasks

- [ ] Create `ProjectEditor` admin fragment in `functions/admin/projects.tsx` (AC: 1)
- [ ] Integrate a Markdown editor (SimpleMDE or similar lightweight) (AC: 2)
- [ ] Implement Project Create/Update handlers in `functions/api/projects/` (AC: 3)
- [ ] Implement instant 'published' toggle with HTMX (AC: 4)

## Dev Notes

- **Editor**: Markdown editor for project showcases [Source: prd.md#FR18]
- **Persistence**: Store in D1, render on public site [Source: epics.md#Story 6.2]

### Project Structure Notes

- Admin project logic in `functions/admin/projects.tsx`

### References

- [Source: epics.md#Story 6.2]
- [Source: db/schema.ts#projects]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
