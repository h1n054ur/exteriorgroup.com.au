---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/architecture.md'
---

# exteriorgroup.com.au - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for exteriorgroup.com.au, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitors can access a landing page meeting the performance targets specified in NFR1 and NFR2.
FR2: Visitors can navigate to dedicated pages for Commercial, Residential, Roofing, and Painting.
FR3: Visitors can access contact info and company details from a site-wide navigation structure.
FR4: Visitors can view all content across mobile, tablet, and desktop with layouts adaptive to viewport dimensions.
FR5: Visitors can browse a gallery of completed projects to verify service quality.
FR6: Visitors can filter project showcases by category (e.g., Commercial, Residential).
FR7: Visitors can view project detail pages with descriptive content and detailed media.
FR8: Visitors can read educational blog posts related to exterior maintenance.
FR10: The system can serve project images globally with minimal load-time impact per NFR1.
FR11: The system can provide "before and after" visual comparisons for project showcases.
FR12: The system can manage a globally distributed library of media assets via R2.
FR13: Visitors can submit project inquiries via a persistent lead capture form.
FR14: The system can capture and categorize lead service type and sector during submission.
FR15: The system can provide real-time validation for form fields using HTMX.
FR16: The system can verify submissions to prevent spam via Turnstile integration.
FR17: The system can associate lead submissions with UTM campaign metadata.
FR18: Authorized users can create and publish project showcases using a Markdown editor.
FR19: Authorized users can manage R2 media assets through the management interface.
FR20: Authorized users can view a centralized list of captured business leads in D1.
FR21: Authorized users can update lead internal statuses (e.g., "New", "Contacted").
FR22: The system can verify administrative credentials to restrict access to management features.
FR23: The system can maintain secure, encrypted sessions for authenticated users.
FR24: The system can mitigate brute-force attempts through IP-based rate limiting.

### NonFunctional Requirements

NFR1: Page TTFB shall be < 200ms for 95% of requests globally.
NFR2: LCP shall be < 1.2 seconds on mid-tier mobile devices over 4G.
NFR3: HTMX transitions shall provide visual feedback within 100ms.
NFR4: Lead data shall be encrypted in transit (TLS 1.3) and at rest (D1 encryption).
NFR5: Admin access shall utilize JWT with HttpOnly, Secure, and SameSite=Lax cookies.
NFR6: Forms shall maintain a < 1% automated spam submission rate via Turnstile.
NFR7: UI shall conform to WCAG 2.1 Level AA accessibility standards.
NFR8: 100% of project images shall include mandatory descriptive alt-text.
NFR9: The website shall maintain 99.9% availability via Cloudflare edge infrastructure.
NFR10: Submission workflows shall use atomic transactions to ensure zero lead data loss.

### Additional Requirements

- **Starter Template**: Custom Hono Workers template (Bun, Hono, Drizzle, HTMX).
- **HDA Pattern**: Hypermedia-Driven Architecture using Hono JSX and HTMX v2.
- **Persistence**: Cloudflare D1 with Drizzle ORM.
- **Asset Strategy**: Cloudflare R2 proxy for legacy and new assets.
- **Admin Shell**: Functional parity with Borderless-Tech dashboard.
- **Interactivity**: "Instant Proof Match" via edge-filtered hypermedia.
- **Typography**: Inter (UI) + Montserrat (Headings).
- **Styling**: Tailwind CSS build-time extraction.

### FR Coverage Map

FR1: Epic 2 - High-Performance Landing Page
FR2: Epic 2 - Service Pillar Navigation
FR3: Epic 2 - Persisten Brand Navigation
FR4: Epic 2 - Adaptive Layout System
FR5: Epic 3 - Project Proof Gallery
FR6: Epic 3 - HDA Category Filtering
FR7: Epic 3 - Detail Fragment Slide-overs
FR8: Epic 6 - Educational Blog Content
FR10: Epic 1 - R2 Global Asset Proxy
FR11: Epic 3 - Interactive Before/After Slider
FR12: Epic 1 - R2 Storage Infrastructure
FR13: Epic 4 - Lead Capture Foundation
FR14: Epic 4 - Lead Categorization Logic
FR15: Epic 4 - Real-time HTMX Validation
FR16: Epic 4 - Turnstile Integration
FR17: Epic 4 - UTM Attribution Tracking
FR18: Epic 6 - Project Showcase CMS
FR19: Epic 6 - Admin R2 Media Management
FR20: Epic 6 - Admin Lead Dashboard
FR21: Epic 6 - Lead Status Workflow
FR22: Epic 5 - Admin Authentication
FR23: Epic 5 - JWT Session Management
FR24: Epic 5 - Brute-force Mitigation

## Epic List

### Epic 1: Foundations & Core Infrastructure
Establish the technical base including the Hono application shell, D1 database schema, and R2 asset proxy logic.
**FRs covered:** FR10, FR12.

### Epic 2: Public Identity & Adaptive Performance
Implement the primary landing page and service pillars with a focus on meeting aggressive edge performance targets.
**FRs covered:** FR1, FR2, FR3, FR4.

### Epic 3: Visual Proof & Discovery
Build the interactive project gallery using the "Instant Proof Match" pattern and high-impact visual components.
**FRs covered:** FR5, FR6, FR7, FR11.

### Epic 4: Resilient Lead Capture
Implement the conversion engine with robust validation, spam protection, and atomic data persistence.
**FRs covered:** FR13, FR14, FR15, FR16, FR17.

### Epic 5: Administrative Command Shell
Establish the secure, authenticated management interface mirroring the Borderless-Tech functional patterns.
**FRs covered:** FR22, FR23, FR24.

### Epic 6: Operations & Content Management
Provide the tools for managing business leads and publishing new project showcases.
**FRs covered:** FR18, FR19, FR20, FR21, FR8.

### Epic 7: Intelligence & Analytics
Converge GA4 telemetry and custom D1 event logging into a real-time business performance dashboard.
**FRs covered:** (Supporting Business Success Criteria)

## Epic 1: Foundations & Core Infrastructure
Establish the technical base including the Hono application shell, D1 database schema, and R2 asset proxy logic.

### Story 1.1: Project Initialization & Scaffolding
As a developer,
I want to initialize the Bun-powered Hono application with the Cloudflare Workers template,
So that I have a strictly typed edge-native foundation for the project.

**Acceptance Criteria:**
**Given** a clean project directory
**When** I run the `bun create hono` command with the `cloudflare-workers` template
**Then** the project is scaffolded with `src/app.tsx`, `wrangler.toml`, and `package.json`
**And** the `nodejs_compat` flag is enabled in `wrangler.toml`.

### Story 1.2: Drizzle Schema Definition
As a developer,
I want to define the unified database schema in `db/schema.ts`,
So that I have a type-safe relational model for leads, projects, and events.

**Acceptance Criteria:**
**Given** the Drizzle ORM dependencies are installed
**When** I define the `leads`, `blog_posts`, and `analytics_events` tables
**Then** the schema follows the `snake_case` plural naming convention
**And** `drizzle-kit generate` produces valid SQL migrations in `db/migrations/`.

### Story 1.3: R2 Global Asset Proxy
As a visitor,
I want to load high-resolution project images via a localized proxy route,
So that I experience minimal load-time impact while viewing original quality proof.

**Acceptance Criteria:**
**Given** an R2 bucket binding in `wrangler.toml`
**When** I request an asset via `/api/assets/[...path]`
**Then** the Worker streams the object directly from R2 with appropriate cache headers
**And** the request meets the TTFB < 200ms target.

## Epic 2: Public Identity & Adaptive Performance
Implement the primary landing page and service pillars with a focus on meeting aggressive edge performance targets.

### Story 2.1: Base Hono Layout & Responsive Navigation
As a visitor,
I want a consistent site shell with a persistent Montserrat-based navigation,
So that I can easily move between services on any device.

**Acceptance Criteria:**
**Given** the Hono JSX renderer
**When** I load any public route
**Then** the Montserrat headings and Inter UI typography are applied correctly
**And** the navigation bar is responsive across mobile, tablet, and desktop breakpoints.

### Story 2.2: Landing Page Service Pillars
As a property manager,
I want to see the core service pillars (Roofing, Painting, Strata) immediately on the home page,
So that I can quickly self-select the relevant proof category.

**Acceptance Criteria:**
**Given** the "Edge-Native Hybrid" design direction
**When** I land on the home page
**Then** the 3 primary service pillars are prominently displayed with "Safety Amber" triggers
**And** the layout meets the LCP < 1.2s target on mobile.

### Story 2.3: Adaptive Performance Optimization
As a mobile user on a 4G connection,
I want the site to load and respond instantly,
So that I can get the information I need without frustration.

**Acceptance Criteria:**
**Given** the Cloudflare edge runtime
**When** the landing page is audited via Lighthouse
**Then** the Performance score is > 95
**And** all static assets are served with optimal cache-control headers.

## Epic 3: Visual Proof & Discovery
Build the interactive project gallery using the "Instant Proof Match" pattern and high-impact visual components.

### Story 3.1: Project Proof Gallery Masonry Grid
As a visitor,
I want to view a gallery of completed projects in a clean masonry layout,
So that I can quickly scan the quality of work through high-impact visuals.

**Acceptance Criteria:**
**Given** a set of project data in D1
**When** I navigate to the gallery
**Then** projects are displayed in a Tailwind-based masonry grid
**And** each card uses skeleton loaders while R2 images are fetching.

### Story 3.2: HDA Category Filtering (HTMX)
As a visitor,
I want to filter the project gallery by service type without a full page reload,
So that my discovery experience feels app-like and immediate.

**Acceptance Criteria:**
**Given** HTMX is loaded in the layout
**When** I select a category filter (e.g., 'Roofing')
**Then** HTMX performs an `hx-get` to `/api/fragments/gallery?category=roofing`
**And** the grid items are swapped in-place within 200ms.

### Story 3.3: Project Detail Fragment Slide-overs
As a strata manager,
I want to view deep project details in a slide-over fragment,
So that I can see technical challenges solved without losing my place in the gallery.

**Acceptance Criteria:**
**Given** a selected Proof Card
**When** I tap 'View Proof'
**Then** an `hx-target` fragment loads the project details into a slide-over container
**And** the detail fragment includes high-res media and Markdown descriptions.

### Story 3.4: Before/After Interactive Slider
As a visitor,
I want to compare restoration progress using an interactive slider,
So that I can visually validate the transformation quality.

**Acceptance Criteria:**
**Given** a project with 'before' and 'after' images
**When** I drag the slider handle on a Proof Card or Detail fragment
**Then** the images are revealed proportionally to the handle position
**And** the interaction is touch-optimized for mobile.

## Epic 4: Resilient Lead Capture
Implement the conversion engine with robust validation, spam protection, and atomic data persistence.

### Story 4.1: Unified Lead Inquiry Form
As a potential client,
I want a simple, conversational inquiry form that works perfectly on my phone,
So that I can request a quote with minimal friction.

**Acceptance Criteria:**
**Given** the "Safety Amber" design triggers
**When** I open the inquiry form
**Then** the form utilizes floating labels and contextual help text
**And** the submission button is prominently styled in Amber.

### Story 4.2: Real-time HTMX Field Validation
As a user in a hurry,
I want to see immediate feedback if I've entered incorrect information,
So that I can fix errors before attempting to submit.

**Acceptance Criteria:**
**Given** a lead capture form
**When** I blur an input field (e.g., email or phone)
**Then** HTMX triggers a server-side validation check
**And** inline error fragments appear instantly if validation fails.

### Story 4.3: Turnstile & Atomic D1 Persistence
As a business owner,
I want every legitimate lead to be securely stored in my database,
So that I never miss a commercial opportunity due to spam or system failure.

**Acceptance Criteria:**
**Given** a valid form submission
**When** the Turnstile token is verified
**Then** the lead is written to D1 within an atomic transaction
**And** an instant success fragment replaces the form without a redirect.

## Epic 5: Administrative Command Shell
Establish the secure, authenticated management interface mirroring the Borderless-Tech functional patterns.

### Story 5.1: Admin JWT Authentication
As an administrator,
I want to log in securely using a password and JWT session,
So that I can manage sensitive business leads and content.

**Acceptance Criteria:**
**Given** the login route
**When** I enter valid credentials
**Then** a JWT is issued via an HttpOnly, Secure cookie
**And** brute-force attempts are mitigated via IP-based rate limiting in D1.

### Story 5.2: Borderless-Tech Sidebar & Dashboard Shell
As David,
I want a unified dashboard with a fixed sidebar and collapsible menus,
So that I can navigate between leads and projects efficiently.

**Acceptance Criteria:**
**Given** an authenticated session
**When** I access `/admin`
**Then** the layout mirrors the Borderless-Tech sidebar pattern
**And** the main content area loads feature fragments via HTMX.

## Epic 6: Operations & Content Management
Provide the tools for managing business leads and publishing new project showcases.

### Story 6.1: Lead Management & Status Workflow
As David,
I want to view a list of all inquiries and update their status,
So that I can track the progress of my commercial pipeline.

**Acceptance Criteria:**
**Given** the Admin Lead dashboard
**When** I update a lead status (e.g., to 'Contacted')
**Then** the change is persisted to D1 via an inline HTMX update
**And** a "Saved" visual feedback fragment appears instantly.

### Story 6.2: Project Showcase CRUD & Markdown Editor
As David,
I want to create and edit project showcases using a Markdown editor,
So that I can publish new work without needing a developer.

**Acceptance Criteria:**
**Given** the Admin Project dashboard
**When** I save a new project with Markdown content
**Then** the content is stored in D1 and rendered correctly on the public site
**And** I can toggle the 'published' status instantly.

### Story 6.3: Admin R2 Media Upload & Asset List
As David,
I want to drag and drop photos directly into the admin panel for upload to R2,
So that I can easily populate my project showcases.

**Acceptance Criteria:**
**Given** the Project Editor
**When** I drop a file into the upload zone
**Then** the file is uploaded directly to R2
**And** the asset is associated with the current project record in D1.

## Epic 7: Intelligence & Analytics
Converge GA4 telemetry and custom D1 event logging into a real-time business performance dashboard.

### Story 7.1: Combined Analytics Dashboard (GA4 + D1)
As David,
I want to see a combined view of my site traffic and lead conversion rates,
So that I can understand which services are driving the most business.

**Acceptance Criteria:**
**Given** the Admin Analytics tab
**When** I load the dashboard
**Then** data is fetched from the Cloudflare Analytics API and local D1 event logs
**And** the results are presented in standardized Borderless-Tech viz cards.
