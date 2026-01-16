---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: 'Fri Jan 16 2026'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/research/technical-cloudflare-hono-htmx-research-2026-01-16.md'
  - '_bmad-output/analysis/brainstorming-session-2026-01-16.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/source-tree-analysis.md'
  - 'docs/development-guide.md'
project_name: 'exteriorgroup.com.au'
user_name: 'Hani'
date: 'Fri Jan 16 2026'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The project focuses on high-performance service presentation and lead capture. Architecturally, this requires a request-to-fragment pipeline (Hono/HTMX) that delivers visual proof instantly. The administrative component requires high-fidelity CRUD operations and real-time telemetry mirroring the **borderless-tech** reference project.

**Non-Functional Requirements:**
- **Edge Performance**: Mandatory TTFB < 200ms and LCP < 1.2s require aggressive edge-caching and optimized R2 asset proxying.
- **Security**: JWT-based session management with HttpOnly cookies and atomic D1 lead submission transactions.
- **Zero-Egress Strategy**: Utilizing Cloudflare R2 for all project media to eliminate storage-related egress costs.

**Scale & Complexity:**
The system is classified as **Medium Complexity** due to the specific hypermedia-driven interaction patterns and the requirement for functional parity with an existing complex administrative project.

- Primary domain: Full-Stack Web (Edge-Native)
- Complexity level: Medium
- Estimated architectural components: 5 (Hono Worker, D1 Persistence, R2 Object Store, HTMX Front-end, Admin Shell)

### Technical Constraints & Dependencies

- **Runtime**: Bun (Dev) / Cloudflare Workers (Prod)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Persistence Layer**: Drizzle ORM
- **Security**: Cloudflare Turnstile (Spam), JOSE (JWT/HMAC)
- **Reference Constraint**: Must implement the "Admin Command Shell" and analytics logic from **borderless-tech-2026**.

### Cross-Cutting Concerns Identified

- **HDA Feedback Loops**: Standardizing how fragments communicate state (Success/Error) across the edge boundary.
- **Media Optimization Pipeline**: Streamlining R2 asset delivery to meet aggressive mobile LCP targets.
- **Telemetry Convergence**: Merging GA4 events with persistent D1 event logs for the Admin dashboard.

## Starter Template Evaluation

### Primary Technology Domain

**Edge-Native Full-Stack Web Application** based on project requirements analysis.

### Starter Options Considered

1.  **Standard Hono Worker**: High-speed routing but requires manual setup for D1/R2.
2.  **Drizzle D1 Boilerplate**: Focused on persistence but lacks the HDA (HTMX) interactive layer.
3.  **The "Exterior-Edge" Custom Stack (Selected)**: Combining the official Hono Workers template with Drizzle ORM and HTMX v2.

### Selected Starter: Custom Hono Cloudflare Workers Starter

**Rationale for Selection:**
This stack provides the highest performance ceiling for mobile users (< 1.2s LCP) while maintaining functional parity with the **borderless-tech** reference project. It leverages Bun for development speed and the native Cloudflare V8 runtime for global scale.

**Initialization Command:**

```bash
bun create hono@latest exterior-group --template cloudflare-workers
bun add drizzle-orm jose marked htmx.org
bun add -d drizzle-kit wrangler @cloudflare/workers-types
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- **TypeScript**: Strictly typed components and API fragments.
- **Runtime**: Cloudflare Workers (V8) with `nodejs_compat` compatibility flag.

**Styling Solution:**
- **Tailwind CSS**: Utility-first CSS processed during the build step, ensuring zero runtime CSS overhead.

**Build Tooling:**
- **Wrangler 3.x**: CLI-based management for D1 migrations, R2 bucket synchronization, and worker deployment.

**Testing Framework:**
- **Vitest**: Using `@cloudflare/vitest-pool-workers` for unit and integration testing of Hono routes.

**Code Organization:**
- **Fragment-Based**: Adhering to the Hypermedia-Driven Architecture (HDA), where routes return HTML partials rather than JSON.
- **Reference Parity**: Reusing the directory structure from Borderless-Tech (functions/_shared, db/schema.ts).

**Development Experience:**
- **Bun**: Ultra-fast install and execution during development.
- **Minification**: Production builds minified via Wrangler for optimal edge execution.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- **Unified Edge Runtime**: Using Cloudflare Workers with Hono to handle both API and SSR fragments.
- **D1 + Drizzle Persistence**: Establishing the schema early to enable lead capture and project discovery.
- **HDA Pattern**: Using HTMX for all interactivity to avoid heavy JS bundles.

**Important Decisions (Shape Architecture):**
- **R2 Proxy Logic**: Implementation of a dedicated Worker route to stream and optimize legacy assets from R2.
- **Admin Shell Parity**: Mirroring the **borderless-tech** navigation and state management for David's dashboard.

**Deferred Decisions (Post-MVP):**
- **Automated Image Optimization**: Using Cloudflare Images for dynamic resizing (deferred to Phase 2).
- **WebSocket Lead Alerts**: Real-time notifications for David (deferred to Phase 3).

### Data Architecture

- **Database**: **Cloudflare D1** (SQLite). Verified for edge production readiness.
- **Modeling**: Relational schema defined in `db/schema.ts` using **Drizzle ORM**.
- **Migrations**: Managed via **Drizzle Kit**.
- **Validation**: **Zod** integration with Hono for type-safe form and fragment handling.

### Authentication & Security

- **Authentication**: **JWT (jose)** with HMAC-SHA256 signatures.
- **Session Management**: HttpOnly, Secure, SameSite=Lax cookies.
- **Spam Defense**: **Cloudflare Turnstile** integrated into all HTMX lead capture fragments.
- **Encryption**: TLS 1.3 in transit; D1 native encryption at rest.

### API & Communication Patterns

- **Architecture**: **Hypermedia-Driven Architecture (HDA)**.
- **Format**: All dynamic routes return HTML fragments (Hono JSX).
- **Interoperability**: Standardized `hx-target` and `hx-swap` patterns for predictable UI updates.
- **Error Handling**: Middleware-driven fragment returns for 400/500 states.

### Frontend Architecture

- **Framework**: **Hono JSX** (Server-side rendering of fragments).
- **Interactivity**: **HTMX v2**.
- **Styling**: **Tailwind CSS v3.4+** (Build-time utility extraction).
- **State**: Server-managed state via D1 sessions and fragment context.

### Infrastructure & Deployment

- **Hosting**: **Cloudflare Workers** with **Static Assets**.
- **Object Storage**: **Cloudflare R2** for all project media and migration of legacy photos.
- **CI/CD**: GitHub Actions using `cloudflare/wrangler-action@v3`.

### Decision Impact Analysis

**Implementation Sequence:**
1.  **Project Init**: Scaffold Hono + Wrangler + Tailwind.
2.  **Schema Definition**: Drizzle schema for `leads` and `projects`.
3.  **HDA Foundation**: Base layout and HTMX fragment routing.
4.  **Admin Parity**: Implementation of the Borderless-Tech shell.

**Cross-Component Dependencies:**
- **R2 Proxy** must be stable before **Proof Cards** can be implemented.
- **JWT Middleware** is a prerequisite for the **Admin Dashboard** functionality.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
- **Schema Consistency**: Ensuring D1 table names and column formats match the Drizzle definitions across all agents.
- **Fragment Contracts**: Standardizing the `hx-target` IDs and expected HTML wrapper types.
- **Asset Access**: Consistency in how R2 keys are constructed and proxied.

### Naming Patterns

**Database Naming Conventions:**
- **Tables**: `snake_case` plural (e.g., `blog_posts`, `analytics_events`).
- **Columns**: `snake_case` (e.g., `featured_image_url`, `created_at`).
- **Primary Keys**: `id` (integer primary key auto-increment).

**API Naming Conventions:**
- **Routes**: `kebab-case` (e.g., `/api/project-discovery`, `/api/lead-capture`).
- **Parameters**: `camelCase` (e.g., `?categoryName=roofing`).
- **Fragments**: Prefixed with `/api/fragments/` for reusable partials.

**Code Naming Conventions:**
- **Components**: `PascalCase` (e.g., `ProofCard`, `AdminShell`).
- **Files**: `kebab-case.tsx` or `.ts` (e.g., `proof-card.tsx`).
- **Variables/Functions**: `camelCase`.

### Structure Patterns

**Project Organization:**
- **`src/`**: Shared logic, core Hono app, and JSX components.
- **`db/`**: Schema definitions (`schema.ts`) and migrations.
- **`worker/`**: Entry point for Cloudflare Workers.
- **`functions/`**: Logic mirroring the **borderless-tech** shared directory pattern.

**File Structure Patterns:**
- **`_shared/`**: Common utilities (Auth, Turnstile, DB helpers).
- **`dist/`**: The target for static assets and build output.

### Format Patterns

**API Response Formats:**
- **Public**: Pure HTML fragments (no JSON wrappers).
- **Admin**: Standardized JSON for data tables: `{ "data": [], "meta": {} }`.
- **Errors**: HTML fragment with `text-red-500` and `hx-swap-oob="true"` for targeted updates.

**Data Exchange Formats:**
- **Dates**: ISO 8601 strings (`YYYY-MM-DDTHH:mm:ssZ`).
- **Booleans**: Native `true/false`.

### Process Patterns

**Error Handling Patterns:**
- **Field-Level**: HTMX `hx-post` validation returns individual `<p>` fragments for invalid fields.
- **Global**: 500 errors return a generic "System Busy" fragment to `#content`.

**Loading State Patterns:**
- **Skeletons**: Preferred over spinners. Use Tailwind `animate-pulse` on placeholder boxes.
- **Indicators**: HTMX `hx-indicator` using a fixed top-bar progress line.

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the **Drizzle Relational Query API** (`db.query.*.findMany`) for read operations.
- Utilize **Zod** for all incoming request validation.
- Proxy all R2 media via the `/assets/*` route; never link directly to R2 public URLs in components.

### Pattern Examples

**Good Examples:**
- `db.insert(leads).values({ name: 'Hani', ... }).run()`
- `<button hx-post="/api/leads" hx-target="#form-container">Submit</button>`

**Anti-Patterns:**
- Hardcoding `localhost:8787` in fragment links (use relative paths).
- Returning full `<html>` documents from `/api/*` routes.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
exterior-group/
├── README.md
├── package.json
├── wrangler.toml           # D1, R2, and Static Asset bindings
├── tailwind.config.js
├── tsconfig.json
├── drizzle.config.ts       # Migration & local D1 config
├── .env                    # Local dev secrets
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml      # cloudflare/wrangler-action@v3
├── db/
│   ├── schema.ts           # Unified Drizzle schema
│   └── migrations/         # Generated SQL migrations
├── src/
│   ├── app.tsx             # Hono application entry & middleware
│   ├── layout.tsx          # Base Hono JSX shell
│   ├── components/
│   │   ├── ui/             # Tailwind base atoms
│   │   ├── proof/          # Proof Card & Gallery components
│   │   ├── forms/          # Lead capture & Turnstile components
│   │   └── admin/          # David's Command Shell components
│   ├── lib/
│   │   ├── db.ts           # D1 connector helper
│   │   ├── r2.ts           # R2 proxy & upload logic
│   │   └── auth.ts         # JWT & HMAC session logic
│   └── types/
│       └── bindings.d.ts   # Cloudflare Env types
├── functions/              # HDA Fragment Logic
│   ├── api/
│   │   ├── fragments/      # UI Partial routes
│   │   ├── leads/          # D1 submission handlers
│   │   └── assets/         # R2 proxy route ([...path].ts)
│   └── admin/              # Protected dashboard routes
├── tests/
│   ├── routes/             # Hono route integration tests
│   └── components/         # JSX snapshot tests
└── dist/                   # Build output (Static Assets)
```

### Architectural Boundaries

**API Boundaries:**
- **Fragment Layer**: `/api/fragments/*` serves Hono JSX partials.
- **Persistence Layer**: Internal boundary via Drizzle ORM; no direct SQL strings in routes.
- **Storage Layer**: `/api/assets/*` acts as the secure, authenticated proxy to R2.

**Component Boundaries:**
- **Server Components**: 100% of UI components are rendered on the edge using Hono JSX.
- **Interactivity Boundary**: Handled via declarative HTMX attributes; no custom `useEffect` or client-side stores.

**Data Boundaries:**
- **Primary Schema**: `db/schema.ts` is the single source of truth for all agents.
- **Access Pattern**: All D1 operations MUST use the Relational Query API for consistency.

### Requirements to Structure Mapping

**Feature Mapping:**
- **Lead Capture**: `functions/api/leads/`, `src/components/forms/`, `db/schema.ts (leads table)`.
- **Project Discovery**: `functions/api/fragments/`, `src/components/proof/`.
- **Admin Dashboard**: `functions/admin/`, `src/components/admin/`.

**Cross-Cutting Concerns:**
- **Authentication**: `src/lib/auth.ts`, `src/app.tsx (middleware)`.
- **Media Proxy**: `functions/api/assets/`, `src/lib/r2.ts`.

### Integration Points

- **Internal**: Components use `c.env.DB` and `c.env.R2_BUCKET` via the Hono Context.
- **External**: GA4 via server-side measurement protocol; Turnstile via Hono middleware verification.
- **Data Flow**: `HTMX Trigger` → `Hono Fragment Route` → `Drizzle Read/Write` → `JSX Render` → `HTML Swap`.

### File Organization Patterns

- **Co-location**: Fragments are grouped by feature under `functions/api/`.
- **Type-Safety**: Bindings are centrally defined in `types/bindings.d.ts` and used as generics in the Hono app.
- **Migration Path**: Legacy assets are moved to R2; legacy HTML is converted to Hono JSX in `src/components/`.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All chosen technologies reside within the native Cloudflare Worker ecosystem. Bun (Runtime) → Hono (Web) → D1 (Persistence) → R2 (Storage) represents a zero-friction, edge-native stack. No version conflicts are present.

**Pattern Consistency:**
Implementation patterns (HDA, Fragment Swapping) directly support the aggressive performance requirements. Naming conventions are unified across Database, API, and Code layers to prevent AI agent drift.

**Structure Alignment:**
The project tree explicitly separates HDA fragment logic from core library utilities, mirroring the successfully deployed **borderless-tech** architecture.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
Every capability defined in the PRD (from lead capture to the admin dashboard) is mapped to a specific architectural component and file location. 

**Non-Functional Requirements Coverage:**
- **LCP/TTFB**: Addressed through edge-first rendering and optimized R2 proxying.
- **Security**: Addressed through JOSE (JWT), Turnstile (Spam), and Atomic D1 transactions.
- **Reliability**: Guaranteed by the global Cloudflare edge distribution.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions (Blocked/Important) are finalized. Deferred decisions (Post-MVP) do not block the initial implementation phase.

**Structure Completeness:**
The provided project tree is specific enough for an AI agent to scaffold the project structure in a single execution.

**Pattern Completeness:**
All primary conflict points (Naming, Structure, Error Handling) have clear, enforceable rules.

### Gap Analysis Results

- **No Critical Gaps Found**: The architecture is complete for the Phase 1 MVP.
- **Important Gap**: Specific GA4 Measurement Protocol event schemas (Deferred to Epic creation).
- **Minor Gap**: Shared UI component library list (Addressed in UX Specification).

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (Fixed Stack)
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Hono/HTMX/D1/R2)
- [x] Integration patterns defined (HDA)
- [x] Performance considerations addressed (< 1.2s LCP)

**✅ Implementation Patterns**
- [x] Naming conventions established (snake_case/PascalCase)
- [x] Structure patterns defined (functions/api/fragments)
- [x] Communication patterns specified (declarative HTMX)
- [x] Process patterns documented (Skeleton loading)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH based on reference project parity.

**Key Strengths:**
- Extreme performance potential through edge-native rendering.
- Zero-cost asset storage/egress (R2).
- Proven administrative patterns (Borderless-Tech).

**Areas for Future Enhancement:**
- Automated R2 image resizing pipeline.
- Real-time client notifications.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow the **`exterior-group/`** structure exactly.
- Use **`db/schema.ts`** as the source of truth for all persistence.
- Return **Fragments** from `/api/*` routes; never JSON (except for Admin analytics).

**First Implementation Priority:**
```bash
bun create hono@latest exterior-group --template cloudflare-workers
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** Fri Jan 16 2026
**Document Location:** _bmad-output/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions.
- Implementation patterns ensuring AI agent consistency.
- Complete project structure with all files and directories.
- Requirements to architecture mapping.
- Validation confirming coherence and completeness.

**🏗️ Implementation Ready Foundation**
- Established a Bun-powered Hono/HTMX/D1/R2 edge-native stack.
- Defined high-performance HDA interaction patterns.
- Ensured functional parity with the borderless-tech project.

**📚 AI Agent Implementation Guide**
- Technology stack: Hono, HTMX, D1, R2, Drizzle, Tailwind.
- Consistency rules: snake_case DB, PascalCase components, kebab-case files.
- Project structure: `exterior-group/` root with feature-based fragment routing.

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing **exteriorgroup.com.au**. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
```bash
bun create hono@latest exterior-group --template cloudflare-workers
```

**Development Sequence:**
1. Initialize project using the documented starter template.
2. Set up the Drizzle schema in `db/schema.ts` for leads and projects.
3. Implement the `functions/api/assets` proxy for R2.
4. Build the landing page pillars and lead capture fragments.
5. Implement the Admin Command Shell mirroring Borderless-Tech.

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts.
- [x] Technology choices are compatible.
- [x] Patterns support the architectural decisions.
- [x] Structure aligns with all choices.

**✅ Requirements Coverage**
- [x] All functional requirements are supported.
- [x] All non-functional requirements are addressed.
- [x] Cross-cutting concerns are handled.
- [x] Integration points are defined.

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable.
- [x] Patterns prevent agent conflicts.
- [x] Structure is complete and unambiguous.
- [x] Examples are provided for clarity.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅
