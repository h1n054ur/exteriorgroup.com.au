# Story 4.3: Turnstile & Atomic D1 Persistence

Status: ready-for-dev

## Story

As a business owner,
I want every legitimate lead to be securely stored in my database,
so that I never miss a commercial opportunity due to spam or system failure.

## Acceptance Criteria

1. **Given** a valid form submission
2. **When** the Turnstile token is verified
3. **Then** the lead is written to D1 within an atomic transaction
4. **And** an instant success fragment replaces the form without a redirect.

## Tasks / Subtasks

- [ ] Implement `functions/api/leads/submit.tsx` (AC: 1, 3)
  - [ ] Verify Cloudflare Turnstile token via middleware or helper
  - [ ] Insert lead into D1 using Drizzle
- [ ] Capture UTM parameters and landing page context (FR17) (AC: 3)
- [ ] Return `SuccessMessage` fragment upon successful insertion (AC: 4)

## Dev Notes

- **Security**: Cloudflare Turnstile integrated into lead capture [Source: architecture.md#Authentication & Security]
- **Persistence**: Atomic D1 lead submission transactions [Source: architecture.md#Requirements Overview]
- **Tracking**: Associate lead submissions with UTM metadata [Source: prd.md#FR17]

### Project Structure Notes

- Submission route in `functions/api/leads/submit.tsx`

### References

- [Source: epics.md#Story 4.3]
- [Source: db/schema.ts#leads]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
