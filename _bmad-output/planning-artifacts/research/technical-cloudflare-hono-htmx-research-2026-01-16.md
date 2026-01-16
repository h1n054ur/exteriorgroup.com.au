---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
...
## Technology Stack Analysis

### Programming Languages
The modernization will use **TypeScript** as the primary language, running on the **Bun** runtime for development and **Cloudflare Workers** (V8) for production.
- _Language Evolution_: Transitioning from static `.htm` and plain `.js` to strongly-typed TypeScript with JSX (Hono).
- _Performance_: Edge-native execution with near-zero cold starts.
- _Source_: [Hono Docs](https://hono.dev/getting-started/cloudflare-workers), [Bun Docs](https://bun.sh/docs)

### Development Frameworks and Libraries
- **Hono**: Ultrafast web framework for the edge. Used for routing, JSX templating, and middleware.
- **HTMX v2**: Used for high-performance dynamic partial updates. Replaces the need for a heavy client-side SPA framework.
- **Tailwind CSS**: Proposed for modernizing the UI while retaining legacy branding colors.
- _Source_: [Hono Cloudflare Workers](https://hono.dev/getting-started/cloudflare-workers), [HTMX v2 Release](https://htmx.org/posts/2024-06-17-htmx-2-0-0-released/)

### Database and Storage Technologies
- **Cloudflare D1**: SQL database for lead storage, blog posts, and site metadata.
- **Cloudflare R2**: Object storage for reusing legacy photos and assets. Centralizes assets for global CDN delivery.
- **Drizzle ORM**: Type-safe ORM for interacting with D1.
- _Source_: [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started-d1), [R2 Documentation](https://developers.cloudflare.com/r2/)

### Development Tools and Platforms
- **Wrangler 3.x**: The CLI for managing Cloudflare resources (D1, R2, Workers, Static Assets).
- **Drizzle Kit**: For database migrations and schema prototyping.
- _Source_: [Cloudflare Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)

### Cloud Infrastructure and Deployment
- **Cloudflare Workers with Static Assets**: The primary hosting model. Use `run_worker_first` in `wrangler.toml` to prioritize Hono routes for API and dynamic pages while falling back to static assets in `dist/`.
- **Workers Analytics Engine (WAE)**: For building the custom admin dashboard with SQL-based telemetry.
- _Source_: [Cloudflare Static Assets Migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

### Technology Adoption Trends
- **Migration Pattern**: Moving from "Static CMS Export" to "Hypermedia-Driven Architecture (HDA)" on the edge.
- **Emerging Tech**: HTMX v2 and Cloudflare D1 are currently state-of-the-art for lightweight, high-performance web apps.
- _Source_: [HTMX Hypermedia-Driven Applications](https://htmx.org/essays/hypermedia-driven-applications/)

---

## Integration Patterns Analysis

### API Design Patterns
The modernization follows a **Hypermedia-Driven Architecture (HDA)** using Hono and HTMX.
- **RESTful Fragments**: Instead of standard JSON APIs, Hono routes will serve HTMX fragments (HTML partials).
- **Endpoint Pattern**: `/api/fragments/:component` for reusable UI pieces (e.g., `contact-form`, `service-card`).
- **Webhook Integration**: Integration with Cloudflare D1 for real-time lead capture from HTMX forms.
- _Source_: [HTMX Essays](https://htmx.org/essays/hypermedia-driven-applications/)

### Communication Protocols
- **HTTP/3 (QUIC)**: Enabled by default on Cloudflare Workers for ultra-low latency.
- **WebSocket (Optional)**: Cloudflare Workers support WebSockets for potential real-time chat features (similar to Borderless-Tech).
- _Source_: [Cloudflare Workers WebSockets](https://developers.cloudflare.com/workers/runtime-apis/websockets/)

### Data Formats and Standards
- **HTML (Hypermedia)**: The primary data exchange format for frontend updates.
- **JSON**: Used for the admin analytics panel and D1 data persistence.
- **Markdown**: Content format for the dynamic blog (converted to HTML via `marked` or similar).

### System Interoperability Approaches
- **Cloudflare R2 Proxy**: A Hono route (`/assets/*`) can act as a proxy to R2 buckets, handling authentication and resizing on the fly.
- **GA4 Measurement Protocol**: For server-side event tracking within the Cloudflare Worker.
- _Source_: [R2 Worker API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)

### Integration Security Patterns
- **JWT (JSON Web Tokens)**: Used for admin panel authentication (Login/Verify pattern from Borderless-Tech).
- **Cloudflare Turnstile**: Integrated into HTMX forms to prevent spam without annoying CAPTCHAs.
- _Source_: [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)

---

---

## Architectural Patterns Analysis

### Reference Architecture: Borderless-Tech-2026

Based on the analysis of `/home/hani/borderless-tech-2026/`, the following patterns will be adapted:

#### Cloudflare Workers + Static Assets Pattern
```toml
# wrangler.toml structure
name = "exterior-group"
main = "worker/index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "dist"
run_worker_first = ["/api/*", "/admin/*", "/blog/*"]

[[d1_databases]]
binding = "DB"
database_name = "exterior-group-db"
migrations_dir = "drizzle"
```

**Key Insight**: The `run_worker_first` array controls which routes invoke the Worker (Hono) before checking static assets. This enables:
- Static HTML pages served directly from `dist/` (fast, cached)
- Dynamic routes (`/api/*`, `/admin/*`, `/blog/*`) handled by Hono

#### Drizzle ORM + D1 Schema Pattern
From the reference project, the schema includes:
- **Blog system**: `blogCategories`, `blogTags`, `blogPosts`, `blogPostTags` (junction table), `blogReactions`
- **Analytics**: `analyticsSessions`, `analyticsEvents` (flexible JSON eventData)
- **Security**: `loginAttempts` (rate limiting for admin auth)

**For Exterior Group, we will adapt:**
- Simplified blog tables (single category: "Projects" or "News")
- Analytics tables as-is (proven pattern)
- Add `leads` table for contact form submissions
- Add `projectShowcases` table for dynamic portfolio gallery

#### Authentication Pattern (JWT + HMAC)
```typescript
// functions/_shared/auth.ts pattern
import { SignJWT, jwtVerify } from "jose";

// HMAC-SHA256 for password verification (Workers-compatible)
// JWT with HttpOnly cookies for session management
// Rate limiting via loginAttempts table
```

**Security features to copy:**
- CSP middleware with nonce generation
- Cloudflare Turnstile integration for forms
- HMAC password verification (not bcrypt due to Workers limitations)

#### Pages Functions Directory Structure
```
functions/
├── _middleware.ts         # Security headers, CSP
├── _shared/
│   ├── auth.ts           # JWT utilities
│   ├── db.ts             # Drizzle connection helper
│   ├── turnstile.ts      # Spam protection
│   └── types.ts          # Env bindings interface
├── api/
│   ├── auth/
│   │   ├── login.ts
│   │   └── logout.ts
│   ├── leads/            # NEW: Lead capture
│   │   └── submit.ts
│   ├── blog/             # Blog API (HTMX fragments)
│   │   ├── posts.ts
│   │   └── [slug].ts
│   └── analytics/
│       └── combined.ts
└── admin/
    └── [[path]].ts       # SPA-style admin panel
```

### Hono JSX Component Architecture

For HTMX-driven pages, Hono's JSX will render fragments:

```tsx
// Example: Blog post partial (returned via HTMX)
import { Hono } from "hono";
import { jsx } from "hono/jsx";

const app = new Hono();

app.get("/api/blog/posts", async (c) => {
  const posts = await db.query.blogPosts.findMany({
    where: eq(blogPosts.status, "published"),
    limit: 10
  });
  
  return c.html(
    <ul class="blog-list">
      {posts.map(post => (
        <li hx-get={`/api/blog/${post.slug}`} hx-target="#content">
          {post.title}
        </li>
      ))}
    </ul>
  );
});
```

### R2 Asset Management Pattern

```typescript
// functions/api/assets/[...path].ts
export const onRequest: PagesFunction = async ({ params, env }) => {
  const key = (params.path as string[]).join("/");
  const object = await env.R2_BUCKET.get(key);
  
  if (!object) return new Response("Not found", { status: 404 });
  
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
```

---

## Implementation Research

### Database Schema (Adapted for Exterior Group)

```typescript
// db/schema.ts - Exterior Group specific tables

// Blog/Projects system (simplified from Borderless-Tech)
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(), // Markdown
  excerpt: text('excerpt'),
  status: text('status').default('draft').notNull(),
  publishedAt: text('published_at'),
  featuredImageUrl: text('featured_image_url'), // R2 URL
  featuredImageAlt: text('featured_image_alt'),
  category: text('category').default('news'), // 'news' | 'project'
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  viewCount: integer('view_count').default(0).notNull(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
});

// Lead capture (contact form submissions)
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  service: text('service'), // 'commercial' | 'residential' | 'strata'
  message: text('message'),
  source: text('source'), // Page URL where form was submitted
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  status: text('status').default('new').notNull(), // 'new' | 'contacted' | 'closed'
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
});

// Analytics (copy from Borderless-Tech as-is)
export const analyticsSessions = sqliteTable('analytics_sessions', { ... });
export const analyticsEvents = sqliteTable('analytics_events', { ... });
export const loginAttempts = sqliteTable('login_attempts', { ... });
```

### Wrangler Configuration

```toml
# wrangler.toml for Exterior Group

name = "exterior-group"
main = "worker/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "dist"
run_worker_first = ["/api/*", "/admin/*", "/blog/*", "/projects/*"]

[[d1_databases]]
binding = "DB"
database_name = "exterior-group-db"
database_id = "<to-be-generated>"
migrations_dir = "drizzle"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "exterior-group-assets"

[vars]
GA4_PROPERTY_ID = "<to-be-configured>"
SITE_URL = "https://exteriorgroup.com.au"
```

### Migration Strategy for Legacy Assets

1. **Inventory Phase**: Catalog all images in `images/` folder (~50+ photos)
2. **Upload Script**: Use Wrangler CLI to bulk upload to R2
   ```bash
   # One-time migration
   for file in images/*; do
     wrangler r2 object put exterior-group-assets/$file --file=$file
   done
   ```
3. **URL Rewriting**: Update HTML templates to use R2-proxied URLs (`/assets/images/...`)

### Development Setup Commands

```bash
# Initialize project
bun create hono exterior-group-modern --template cloudflare-workers

# Install dependencies
bun add drizzle-orm jose marked htmx.org
bun add -d drizzle-kit wrangler @cloudflare/workers-types

# Create D1 database
wrangler d1 create exterior-group-db

# Create R2 bucket
wrangler r2 bucket create exterior-group-assets

# Run migrations
wrangler d1 execute exterior-group-db --file=drizzle/0000_initial.sql

# Local development
wrangler dev
```

---

## Research Summary and Recommendations

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Runtime** | Cloudflare Workers (V8) | Edge-native, near-zero cold starts, global distribution |
| **Framework** | Hono v4 | Ultrafast, JSX support, perfect Workers integration |
| **Interactivity** | HTMX v2 | No JS bundle, server-driven UI, SEO-friendly |
| **Database** | Cloudflare D1 | SQLite at edge, Drizzle ORM for type safety |
| **Storage** | Cloudflare R2 | Zero egress, CDN-backed, legacy asset migration |
| **Auth** | JWT (jose) + HMAC | Workers-compatible, HttpOnly cookies |
| **Styling** | Tailwind CSS | Keep legacy branding colors via `tailwind.config.js` |
| **Forms** | Cloudflare Turnstile | Spam protection without CAPTCHA friction |

### Implementation Priorities

1. **Phase 1: Foundation**
   - Project scaffold with Hono + Wrangler
   - D1 database with Drizzle schema
   - R2 bucket creation and asset migration script

2. **Phase 2: Core Features**
   - Landing page with HTMX-powered sections
   - Contact form with Turnstile + D1 lead capture
   - Services pages (static with HTMX enhancements)

3. **Phase 3: Dynamic Content**
   - Blog/projects system with Markdown support
   - Admin panel (protected routes, CRUD)
   - Analytics integration (custom + GA4)

4. **Phase 4: Polish**
   - Performance optimization (caching strategies)
   - SEO (sitemap, meta tags, structured data)
   - Testing and deployment pipeline

### Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| D1 cold start latency | Use session affinity hints; optimize query patterns |
| R2 migration complexity | Gradual migration; keep legacy URLs working via redirects |
| HTMX learning curve | Start with simple patterns; document component library |
| SEO impact during migration | Implement 301 redirects; preserve URL structure where possible |

### Source References

- [Hono Cloudflare Workers Guide](https://hono.dev/getting-started/cloudflare-workers)
- [HTMX v2 Documentation](https://htmx.org/docs/)
- [Drizzle ORM D1 Guide](https://orm.drizzle.team/docs/get-started-d1)
- [Cloudflare Workers Static Assets Migration](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Cloudflare R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- Reference Implementation: `/home/hani/borderless-tech-2026/`

---

**Research Status**: ✅ COMPLETE

**Next Step**: Create PRD using `/bmad:bmm:workflows:create-prd`


