# Story 6.3: Admin R2 Media Upload & Asset List

Status: ready-for-dev

## Story

As David,
I want to drag and drop photos directly into the admin panel for upload to R2,
so that I can easily populate my project showcases.

## Acceptance Criteria

1. **Given** the Project Editor
2. **When** I drop a file into the upload zone
3. **Then** the file is uploaded directly to R2
4. **And** the asset is associated with the current project record in D1.

## Tasks / Subtasks

- [ ] Create `FileUpload` component with drag-and-drop support (AC: 2)
- [ ] Implement `functions/api/assets/upload.ts` handler (AC: 3)
  - [ ] Direct R2 bucket `put` operation
- [ ] Update Project record in D1 with the new R2 key (AC: 4)
- [ ] Display asset list/preview in the editor (AC: 1)

## Dev Notes

- **Storage**: Direct upload to Cloudflare R2 [Source: architecture.md#Infrastructure & Deployment]
- **UX**: Drag and drop support [Source: epics.md#Story 6.3]

### Project Structure Notes

- Asset management in `src/lib/r2.ts` and `functions/api/assets/`

### References

- [Source: epics.md#Story 6.3]
- [Source: architecture.md#Zero-Egress Strategy]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
