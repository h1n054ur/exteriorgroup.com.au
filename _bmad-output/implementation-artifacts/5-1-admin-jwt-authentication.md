# Story 5.1: Admin JWT Authentication

Status: ready-for-dev

## Story

As an administrator,
I want to log in securely using a password and JWT session,
so that I can manage sensitive business leads and content.

## Acceptance Criteria

1. **Given** the login route
2. **When** I enter valid credentials
3. **Then** a JWT is issued via an HttpOnly, Secure cookie
4. **And** brute-force attempts are mitigated via IP-based rate limiting in D1.

## Tasks / Subtasks

- [ ] Implement `src/lib/auth.ts` using `jose` (AC: 3)
- [ ] Create `functions/admin/login.tsx` route (AC: 1, 2)
  - [ ] Implement rate limiting check against `login_attempts` table
- [ ] Create JWT validation middleware in `src/app.tsx` or `src/lib/auth.ts` (AC: 3)
- [ ] Implement secure cookie setting (HttpOnly, Secure, SameSite=Lax) (AC: 3)

## Dev Notes

- **Authentication**: JWT (jose) with HMAC-SHA256 signatures [Source: architecture.md#Authentication & Security]
- **Security**: Brute-force mitigation through IP-based rate limiting in D1 [Source: prd.md#FR24]
- **Session**: HttpOnly, Secure, SameSite=Lax cookies [Source: architecture.md#Authentication & Security]

### Project Structure Notes

- Auth logic in `src/lib/auth.ts`
- Admin routes in `functions/admin/`

### References

- [Source: epics.md#Story 5.1]
- [Source: db/schema.ts#login_attempts]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash-thinking-exp

### Debug Log References

### Completion Notes List

### File List
