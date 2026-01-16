# Story 5.2: Borderless-Tech Sidebar & Dashboard Shell

Status: ready-for-dev

## Story

As David,
I want a unified dashboard with a fixed sidebar and collapsible menus,
so that I can navigate between leads and projects efficiently.

## Acceptance Criteria

1. **Given** an authenticated session
2. **When** I access `/admin`
3. **Then** the layout mirrors the Borderless-Tech sidebar pattern
4. **And** the main content area loads feature fragments via HTMX.

## Tasks / Subtasks

- [ ] Create `AdminShell` component in `src/components/admin/admin-shell.tsx` (AC: 3)
- [ ] Implement persistent sidebar with links to Leads, Projects, Analytics (AC: 3)
- [ ] Set up HTMX navigation for the main content area (`hx-boost` or `hx-get`) (AC: 4)
- [ ] Protect `/admin/*` routes with the JWT middleware (AC: 1)

## Dev Notes

- **Reference**: Must implement the "Admin Command Shell" from borderless-tech [Source: architecture.md#Technical Constraints & Dependencies]
- **Interactivity**: Main content area loads fragments via HTMX [Source: epics.md#Story 5.2]

### Project Structure Notes

- Admin shell in `src/components/admin/`

### References

- [Source: epics.md#Story 5.2]
- [Source: borderless-tech reference project]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
