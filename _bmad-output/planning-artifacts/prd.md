---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete', 'step-e-01-discovery', 'step-e-02-review', 'step-e-03-edit']
classification:
  projectType: 'Web App'
  domain: 'General (Commercial Property Maintenance Services)'
  complexity: 'Low'
  projectContext: 'brownfield'
inputDocuments:
  - '_bmad-output/analysis/brainstorming-session-2026-01-16.md'
  - '_bmad-output/planning-artifacts/research/technical-cloudflare-hono-htmx-research-2026-01-16.md'
  - 'docs/index.md'
  - 'docs/project-overview.md'
  - 'docs/architecture.md'
  - 'docs/source-tree-analysis.md'
  - 'docs/development-guide.md'
documentCounts:
  briefCount: 0
  researchCount: 1
  brainstormingCount: 1
  projectDocsCount: 5
workflowType: 'prd'
workflow: 'edit'
lastEdited: 'Fri Jan 16 2026'
editHistory:
  - date: 'Fri Jan 16 2026'
    changes: 'Refined subjective adjectives in Functional Requirements; addressed validation report findings while retaining fixed tech stack.'
---

# Product Requirements Document - exteriorgroup.com.au

**Author:** Hani
**Date:** Fri Jan 16 2026

## Executive Summary

Exterior Group is modernizing its digital presence by transitioning from a legacy Bootstrap 5 static website to a high-performance, edge-native web application. This brownfield project aims to significantly improve user experience, SEO visibility, and lead generation efficiency. By leveraging a modern stack (Bun, Hono, HTMX, and Cloudflare Workers), the project eliminates the maintenance overhead of traditional databases while providing an elite, responsive interface for commercial and residential clients.

## Success Criteria

### User Success
- **Near-Instant Interactivity**: Page loads meeting global LCP targets (< 1.2s) ensuring a frustration-free experience for mobile users on job sites.
- **Visual Validation**: High-resolution project showcases provide immediate proof of quality for roofing and painting services.
- **Frictionless Communication**: Intelligent lead forms with instant feedback (HTMX) and zero-friction spam protection (Turnstile).

### Business Success
- **Increased Lead Volume**: Optimized landing pages and service-specific CTAs improve the conversion rate of visitors to inquiries.
- **Lower Operational Cost**: Migration to Cloudflare R2 and D1 removes egress costs and eliminates traditional server maintenance fees.
- **Market Differentiation**: A technically superior web experience positions Exterior Group as a modern leader in the property maintenance industry.

### Measurable Outcomes
- **Performance**: Lighthouse performance scores > 95 across mobile and desktop.
- **Lead Capture**: > 95% successful capture rate of form submissions in the D1 database.
- **Availability**: 99.9% uptime via Cloudflare's global edge network.

## User Journeys

### 1. Sarah's "Trust and Verify" Journey (Primary - Commercial)
Sarah, a Strata Manager, searching for a reliable commercial painter. She arrives at the site via search, views a relevant strata project case study with high-res photos, and submits a commercial inquiry form. HTMX provides immediate confirmation, and David receives a high-quality lead with full project context.

### 2. Mark's "Midnight Leak" Journey (Primary - Residential)
Mark discovers a roof leak during a storm at 11 PM. Using his mobile device, he hits the fast-loading site, finds the "Emergency Roofing" section, and submits a lead. Real-time validation ensures his phone number is correct without a page reload. His lead is safely stored in D1 for immediate follow-up the next morning.

### 3. David's "Project Pride" Journey (Admin / Operations)
David completes a major restoration and wants to update the site. He logs into the Hono-based admin panel, uploads photos directly to R2, and creates a new project showcase using a Markdown editor. The site updates globally in real-time, and he views the lead dashboard to see recent inquiries.

## Product Scope

### Phase 1: MVP (Foundation & Conversion)
- **Core Migration**: Hono/HTMX re-implementation of existing static landing and service pages.
- **Media Optimization**: Bulk migration of legacy assets to Cloudflare R2 with an edge asset proxy.
- **Lead Capture**: Contact forms with Turnstile integration and D1 database persistence.
- **Base Analytics**: GA4 integration for traffic and conversion tracking.

### Phase 2: Growth (Content & Management)
- **Dynamic CMS**: Markdown-based engine for project showcases and blog posts.
- **Admin Panel**: Secure dashboard for lead management and content creation.
- **Advanced Telemetry**: Combined GA4 + D1 dashboard for deep conversion analysis.

### Phase 3: Vision (Expansion)
- **Client Portal**: Secure area for project progress tracking and digital quote approval.
- **Interactive Scheduler**: Real-time consultation booking integration.

## Innovation & Novel Patterns

- **Hypermedia-Driven Architecture (HDA)**: Utilizing HTMX and Hono JSX to serve HTML fragments directly, reducing client-side JS by >90% while providing an SPA-like user experience.
- **Unified Edge Persistence**: A 100% serverless data strategy using Cloudflare D1 (SQL) and R2 (Objects) to eliminate "web server -> database" latency.

## Web App Specific Requirements

- **Server-Side Rendering (SSR)**: 100% crawlable content rendered via Hono JSX for maximum SEO authority.
- **Browser Support**: Optimized for Chrome, Safari (iOS/macOS), and Edge; mobile-first priority.
- **Responsive Layout**: Tailwind CSS utility-first approach with optimized breakpoints for project imagery.
- **Dynamic Sitemap**: Auto-generated `sitemap.xml` reflects D1 content changes in real-time.

## Functional Requirements

### 1. Public Site Navigation & Brand Presentation
- **FR1**: Visitors can access a landing page meeting the performance targets specified in NFR1 and NFR2.
- **FR2**: Visitors can navigate to dedicated pages for Commercial, Residential, Roofing, and Painting.
- **FR3**: Visitors can access contact info and company details from a site-wide navigation structure.
- **FR4**: Visitors can view all content across mobile, tablet, and desktop with layouts adaptive to viewport dimensions.

### 2. Service Showcase & Content Discovery
- **FR5**: Visitors can browse a gallery of completed projects to verify service quality.
- **FR6**: Visitors can filter project showcases by category (e.g., Commercial, Residential).
- **FR7**: Visitors can view project detail pages with descriptive content and detailed media.
- **FR8**: Visitors can read educational blog posts related to exterior maintenance.

### 3. Project Media Management
- **FR10**: The system can serve project images globally with minimal load-time impact per NFR1.
- **FR11**: The system can provide "before and after" visual comparisons for project showcases.
- **FR12**: The system can manage a globally distributed library of media assets via R2.

### 4. Lead Capture & Validation
- **FR13**: Visitors can submit project inquiries via a persistent lead capture form.
- **FR14**: The system can capture and categorize lead service type and sector during submission.
- **FR15**: The system can provide real-time validation for form fields using HTMX.
- **FR16**: The system can verify submissions to prevent spam via Turnstile integration.
- **FR17**: The system can associate lead submissions with UTM campaign metadata.

### 5. Administrative Content Management
- **FR18**: Authorized users can create and publish project showcases using a Markdown editor.
- **FR19**: Authorized users can manage R2 media assets through the management interface.
- **FR20**: Authorized users can view a centralized list of captured business leads in D1.
- **FR21**: Authorized users can update lead internal statuses (e.g., "New", "Contacted").

### 6. Authentication & Security
- **FR22**: The system can verify administrative credentials to restrict access to management features.
- **FR23**: The system can maintain secure, encrypted sessions for authenticated users.
- **FR24**: The system can mitigate brute-force attempts through IP-based rate limiting.

## Non-Functional Requirements

### Performance
- **NFR1 (Latency)**: Page TTFB shall be < 200ms for 95% of requests globally.
- **NFR2 (Loading)**: LCP shall be < 1.2 seconds on mid-tier mobile devices over 4G.
- **NFR3 (Interactivity)**: HTMX transitions shall provide visual feedback within 100ms.

### Security
- **NFR4 (Encryption)**: Lead data shall be encrypted in transit (TLS 1.3) and at rest (D1 encryption).
- **NFR5 (Access)**: Admin access shall utilize JWT with HttpOnly, Secure, and SameSite=Lax cookies.
- **NFR6 (Spam)**: Forms shall maintain a < 1% automated spam submission rate via Turnstile.

### Accessibility
- **NFR7 (Compliance)**: UI shall conform to WCAG 2.1 Level AA accessibility standards.
- **NFR8 (Alt-Text)**: 100% of project images shall include mandatory descriptive alt-text.

### Reliability
- **NFR9 (Uptime)**: The website shall maintain 99.9% availability via Cloudflare edge infrastructure.
- **NFR10 (Durability)**: Submission workflows shall use atomic transactions to ensure zero lead data loss.
