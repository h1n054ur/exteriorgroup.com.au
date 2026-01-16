/**
 * =============================================================================
 * DATABASE SCHEMA (Drizzle ORM for SQLite/D1)
 * =============================================================================
 *
 * Exterior Group unified schema for:
 * - Lead capture and management
 * - Project showcases (proof gallery)
 * - Blog posts (educational content)
 * - Analytics events
 * - Security (login rate limiting)
 *
 * NAMING CONVENTIONS:
 * - Tables: snake_case plural (e.g., blog_posts, analytics_events)
 * - Columns: snake_case (e.g., featured_image_url, created_at)
 * - Primary Keys: id (integer primary key auto-increment)
 */

import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/* =============================================================================
 * LEADS TABLE
 * =============================================================================
 * Business inquiries from potential clients (FR13-FR17, FR20-FR21)
 */

/**
 * LEADS TABLE
 * ===========
 * Captures business inquiries with service categorization and UTM tracking.
 * 
 * STATUS WORKFLOW:
 * - "new": Fresh inquiry, not yet reviewed
 * - "contacted": Admin has reached out
 * - "quoted": Quote sent to client
 * - "won": Project secured
 * - "lost": Did not convert
 */
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /* -------------------------------------------------------------------------
   * CONTACT INFORMATION
   * -------------------------------------------------------------------------
   */

  /** Full name of the inquirer */
  name: text('name').notNull(),

  /** Email address for follow-up */
  email: text('email').notNull(),

  /** Phone number (Australian format) */
  phone: text('phone'),

  /** Company or property name */
  company: text('company'),

  /* -------------------------------------------------------------------------
   * SERVICE CATEGORIZATION (FR14)
   * -------------------------------------------------------------------------
   */

  /**
   * Service type requested
   * Options: 'roofing' | 'painting' | 'strata' | 'general'
   */
  serviceType: text('service_type').notNull().default('general'),

  /**
   * Sector/market segment
   * Options: 'commercial' | 'residential'
   */
  sector: text('sector').notNull().default('commercial'),

  /** Free-form message from the inquiry form */
  message: text('message'),

  /* -------------------------------------------------------------------------
   * LEAD MANAGEMENT (FR20-FR21)
   * -------------------------------------------------------------------------
   */

  /**
   * Current status in the sales pipeline
   * Options: 'new' | 'contacted' | 'quoted' | 'won' | 'lost'
   */
  status: text('status').notNull().default('new'),

  /** Internal notes from admin (not visible to client) */
  internalNotes: text('internal_notes'),

  /* -------------------------------------------------------------------------
   * UTM ATTRIBUTION (FR17)
   * -------------------------------------------------------------------------
   */

  /** Traffic source (e.g., 'google', 'facebook') */
  utmSource: text('utm_source'),

  /** Marketing medium (e.g., 'cpc', 'organic') */
  utmMedium: text('utm_medium'),

  /** Campaign name (e.g., 'spring2026') */
  utmCampaign: text('utm_campaign'),

  /** Landing page URL where lead originated */
  landingPage: text('landing_page'),

  /* -------------------------------------------------------------------------
   * TIMESTAMPS
   * -------------------------------------------------------------------------
   */

  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),

}, (table) => ({
  statusIdx: index('leads_status_idx').on(table.status),
  serviceTypeIdx: index('leads_service_type_idx').on(table.serviceType),
  createdAtIdx: index('leads_created_at_idx').on(table.createdAt),
}));

/* =============================================================================
 * PROJECTS TABLE
 * =============================================================================
 * Project showcases for the "Proof Gallery" (FR5-FR7, FR11, FR18)
 */

/**
 * PROJECTS TABLE
 * ==============
 * Completed project showcases with before/after imagery.
 * Powers the "Instant Proof Match" gallery experience.
 */
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /* -------------------------------------------------------------------------
   * CORE CONTENT
   * -------------------------------------------------------------------------
   */

  /** Project title (e.g., "Sydney CBD Commercial Complex") */
  title: text('title').notNull(),

  /** URL slug for routing (e.g., 'sydney-cbd-commercial-complex') */
  slug: text('slug').notNull().unique(),

  /** Detailed project description in Markdown */
  description: text('description').notNull(),

  /** Short excerpt for card previews */
  excerpt: text('excerpt'),

  /* -------------------------------------------------------------------------
   * CATEGORIZATION
   * -------------------------------------------------------------------------
   */

  /**
   * Service category for filtering (FR6)
   * Options: 'roofing' | 'painting' | 'strata'
   */
  category: text('category').notNull(),

  /**
   * Market sector
   * Options: 'commercial' | 'residential'
   */
  sector: text('sector').notNull().default('commercial'),

  /** Client/property name (with permission) */
  clientName: text('client_name'),

  /** Project location (suburb/city) */
  location: text('location'),

  /* -------------------------------------------------------------------------
   * MEDIA (FR10, FR11)
   * -------------------------------------------------------------------------
   */

  /** R2 key for the primary/featured image */
  featuredImageKey: text('featured_image_key'),

  /** Alt text for accessibility (NFR8) */
  featuredImageAlt: text('featured_image_alt'),

  /** R2 key for "before" comparison image */
  beforeImageKey: text('before_image_key'),

  /** R2 key for "after" comparison image */
  afterImageKey: text('after_image_key'),

  /**
   * Additional gallery images stored as JSON array of R2 keys
   * Example: ["projects/1/gallery-1.jpg", "projects/1/gallery-2.jpg"]
   */
  galleryImages: text('gallery_images', { mode: 'json' }),

  /* -------------------------------------------------------------------------
   * PUBLISHING
   * -------------------------------------------------------------------------
   */

  /** Whether the project is visible on the public site */
  published: integer('published', { mode: 'boolean' }).default(false).notNull(),

  /** Date the project was completed */
  completedAt: text('completed_at'),

  /* -------------------------------------------------------------------------
   * SEO
   * -------------------------------------------------------------------------
   */

  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),

  /* -------------------------------------------------------------------------
   * TIMESTAMPS
   * -------------------------------------------------------------------------
   */

  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),

}, (table) => ({
  slugIdx: index('projects_slug_idx').on(table.slug),
  categoryIdx: index('projects_category_idx').on(table.category),
  publishedIdx: index('projects_published_idx').on(table.published),
}));

/* =============================================================================
 * BLOG TABLES
 * =============================================================================
 * Educational content system (FR8)
 */

/**
 * BLOG CATEGORIES TABLE
 */
export const blogCategories = sqliteTable('blog_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parentId: integer('parent_id'),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
});

/**
 * BLOG TAGS TABLE
 */
export const blogTags = sqliteTable('blog_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
});

/**
 * BLOG POSTS TABLE
 */
export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /* Core Content */
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),

  /* Publishing */
  status: text('status').default('draft').notNull(), // draft | published | scheduled
  publishAt: text('publish_at'),
  publishedAt: text('published_at'),

  /* Media */
  featuredImageKey: text('featured_image_key'),
  featuredImageAlt: text('featured_image_alt'),

  /* SEO */
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  canonicalUrl: text('canonical_url'),

  /* Organization */
  categoryId: integer('category_id').references(() => blogCategories.id),
  authorName: text('author_name').default('Exterior Group'),

  /* Engagement */
  viewCount: integer('view_count').default(0).notNull(),

  /* Timestamps */
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),

}, (table) => ({
  statusPublishIdx: index('blog_posts_status_publish_idx').on(table.status, table.publishAt),
  slugIdx: index('blog_posts_slug_idx').on(table.slug),
}));

/**
 * BLOG POST TAGS (Junction Table)
 */
export const blogPostTags = sqliteTable('blog_post_tags', {
  postId: integer('post_id')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id')
    .notNull()
    .references(() => blogTags.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
}));

/* =============================================================================
 * ANALYTICS TABLES
 * =============================================================================
 * Custom event tracking (Epic 7)
 */

/**
 * ANALYTICS SESSIONS TABLE
 */
export const analyticsSessions = sqliteTable('analytics_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id').notNull().unique(),

  /* Visitor Info (Privacy-conscious) */
  ipHash: text('ip_hash'),
  country: text('country'),
  region: text('region'),
  city: text('city'),

  /* Device Info */
  userAgent: text('user_agent'),
  browser: text('browser'),
  browserVersion: text('browser_version'),
  os: text('os'),
  deviceType: text('device_type'), // desktop | mobile | tablet

  /* Timing */
  startedAt: text('started_at').default(sql`(datetime('now'))`).notNull(),
  lastSeenAt: text('last_seen_at').default(sql`(datetime('now'))`).notNull(),

  /* Traffic Source */
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  landingPage: text('landing_page'),

}, (table) => ({
  sessionIdIdx: index('analytics_sessions_session_id_idx').on(table.sessionId),
  startedAtIdx: index('analytics_sessions_started_at_idx').on(table.startedAt),
}));

/**
 * ANALYTICS EVENTS TABLE
 */
export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sessionId: text('session_id')
    .notNull()
    .references(() => analyticsSessions.sessionId),

  /* Event Classification */
  eventType: text('event_type').notNull(), // page_view | form_submit | cta_click | scroll_depth
  eventName: text('event_name'),

  /* Page Context */
  pageUrl: text('page_url').notNull(),
  pageTitle: text('page_title'),

  /* Event-Specific Data */
  eventData: text('event_data', { mode: 'json' }),
  scrollDepth: integer('scroll_depth'),
  timeOnPageSeconds: integer('time_on_page_seconds'),

  timestamp: text('timestamp').default(sql`(datetime('now'))`).notNull(),

}, (table) => ({
  sessionEventIdx: index('analytics_events_session_event_idx').on(table.sessionId, table.eventType),
  timestampIdx: index('analytics_events_timestamp_idx').on(table.timestamp),
  eventTypeIdx: index('analytics_events_event_type_idx').on(table.eventType),
}));

/* =============================================================================
 * SECURITY TABLES
 * =============================================================================
 * Rate limiting for brute-force protection (FR24)
 */

/**
 * LOGIN ATTEMPTS TABLE
 */
export const loginAttempts = sqliteTable('login_attempts', {
  ipAddress: text('ip_address').primaryKey(),
  attempts: integer('attempts').default(0).notNull(),
  lockedUntil: text('locked_until'),
  lastAttempt: text('last_attempt').default(sql`(datetime('now'))`).notNull(),
});

/* =============================================================================
 * TYPE EXPORTS
 * =============================================================================
 */

// Leads
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

// Projects
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Blog
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type NewBlogCategory = typeof blogCategories.$inferInsert;
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;

// Analytics
export type AnalyticsSession = typeof analyticsSessions.$inferSelect;
export type NewAnalyticsSession = typeof analyticsSessions.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// Security
export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type NewLoginAttempt = typeof loginAttempts.$inferInsert;
