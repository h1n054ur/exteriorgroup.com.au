CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`event_type` text NOT NULL,
	`event_name` text,
	`page_url` text NOT NULL,
	`page_title` text,
	`event_data` text,
	`scroll_depth` integer,
	`time_on_page_seconds` integer,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `analytics_sessions`(`session_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `analytics_events_session_event_idx` ON `analytics_events` (`session_id`,`event_type`);--> statement-breakpoint
CREATE INDEX `analytics_events_timestamp_idx` ON `analytics_events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `analytics_events_event_type_idx` ON `analytics_events` (`event_type`);--> statement-breakpoint
CREATE TABLE `analytics_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`ip_hash` text,
	`country` text,
	`region` text,
	`city` text,
	`user_agent` text,
	`browser` text,
	`browser_version` text,
	`os` text,
	`device_type` text,
	`started_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_seen_at` text DEFAULT (datetime('now')) NOT NULL,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`landing_page` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `analytics_sessions_session_id_unique` ON `analytics_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `analytics_sessions_session_id_idx` ON `analytics_sessions` (`session_id`);--> statement-breakpoint
CREATE INDEX `analytics_sessions_started_at_idx` ON `analytics_sessions` (`started_at`);--> statement-breakpoint
CREATE TABLE `blog_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`parent_id` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_categories_slug_unique` ON `blog_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `blog_post_tags` (
	`post_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `blog_tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`publish_at` text,
	`published_at` text,
	`featured_image_key` text,
	`featured_image_alt` text,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` text,
	`canonical_url` text,
	`category_id` integer,
	`author_name` text DEFAULT 'Exterior Group',
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_publish_idx` ON `blog_posts` (`status`,`publish_at`);--> statement-breakpoint
CREATE INDEX `blog_posts_slug_idx` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `blog_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_tags_slug_unique` ON `blog_tags` (`slug`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company` text,
	`service_type` text DEFAULT 'general' NOT NULL,
	`sector` text DEFAULT 'commercial' NOT NULL,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`internal_notes` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`landing_page` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_service_type_idx` ON `leads` (`service_type`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`ip_address` text PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	`last_attempt` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`excerpt` text,
	`category` text NOT NULL,
	`sector` text DEFAULT 'commercial' NOT NULL,
	`client_name` text,
	`location` text,
	`featured_image_key` text,
	`featured_image_alt` text,
	`before_image_key` text,
	`after_image_key` text,
	`gallery_images` text,
	`published` integer DEFAULT false NOT NULL,
	`completed_at` text,
	`meta_title` text,
	`meta_description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_slug_idx` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_category_idx` ON `projects` (`category`);--> statement-breakpoint
CREATE INDEX `projects_published_idx` ON `projects` (`published`);