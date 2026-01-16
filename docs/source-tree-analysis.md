# Source Tree Analysis - Exterior Group

## Directory Structure Overview

```
exteriorgroup.com.au/
├── accessibility/       # Accessibility information and tools
├── assets/              # Corporate assets and branding
├── cms/                 # CMS-exported assets (hashed JS/CSS/SVG)
│   ├── includes/        # Compiled CSS and JS bundles
│   ├── svg/             # SVG icon sets
│   └── thumbnails/      # Generated image thumbnails
├── commercial/          # Commercial service pages
├── common/              # Common shared components/styles
├── enquire-now/         # Lead generation / contact forms
├── faq/                 # Frequently Asked Questions
├── fonts/               # Local font files
├── images/              # Site images and logos
├── privacy-policy-backup/ # Legal documentation
├── residential/         # Residential service pages
├── why-us/              # Marketing and testimonials
└── index.htm            # Main entry point (Landing Page)
```

## Critical Folders

- **Root (`/`)**: Contains the primary entry point `index.htm` and core feature folders.
- **`cms/`**: The backbone of the legacy UI, containing all compiled assets. Modernization will likely replace this with a structured component library in HTMX/Hono.
- **`commercial/` & `residential/`**: Content-heavy directories that define the primary business offerings. These will be mapped to Hono routes.
- **`enquire-now/`**: Critical conversion point. Needs to be documented for form logic reconstruction.

## Key Files

- **`index.htm`**: Defines the global layout, navigation, and core dependencies (Bootstrap, GTM).
- **`cms/includes/style.css`**: Main styling file (referenced in `index.htm`).
- **`cms/svg/site/xotfxq7q38s.36.svg`**: Central SVG sprite sheet used for icons across the site.
