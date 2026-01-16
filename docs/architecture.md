# Architecture Documentation - Exterior Group (Legacy)

## System Overview
The current system is a static website where each page or feature group is hosted in its own directory. It relies on a "CMS-exported" asset management system where styles and scripts are bundled into hashed files within the `cms/` directory.

## Architecture Pattern
- **Pattern**: Static Multi-Page Application (MPA)
- **Navigation**: Traditional anchor-based navigation between `.htm` or folder indexes.
- **UI Logic**: Purely client-side, using standard JavaScript and Bootstrap for responsiveness.

## Data Architecture
- **Storage**: No client-side database.
- **Forms**: Lead generation via `/enquire-now/` likely posts to an external handler or legacy backend (to be confirmed during modernization).

## Component Overview
The UI follows a consistent layout pattern defined in `index.htm`:
1. **Header**: Navigation, Accessibility toggles, Branding.
2. **Mainstage**: Hero sections with corporate branding.
3. **Feature Grid**: Services (Residential/Commercial) displayed as cards.
4. **Footer**: Contact info, legal links.

## Modernization Targets
- **Runtime**: **Bun** for fast development and execution.
- **Framework**: **Hono** for high-performance routing and JSX templates.
- **Frontend**: **HTMX** for dynamic partial updates and a modern "SPA feel" without the bloat.
- **Infrastructure**: **Cloudflare Workers** with Static Assets, managed via **Wrangler**.
- **Data Persistence**: **Cloudflare D1** (SQLite) for leads/blog and **Cloudflare R2** for object storage (images/assets).
- **ORM**: **Drizzle ORM** for type-safe database access.
- **Analytics**: Integrated **GA4** and **Cloudflare Web Analytics**.
- **Features**: Modern Landing Page, Dynamic Blog, Admin Analytics Panel (inspired by Borderless-Tech).
