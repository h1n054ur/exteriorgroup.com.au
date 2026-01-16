# Development Guide - Exterior Group

## Current Setup (Legacy)
The project is currently a collection of static assets. 

### Prerequisites
- Any local web server (e.g., `python -m http.server`, `npx serve`, or `bunx serve`).

### Running Locally
1. Clone the repository.
2. Serve the root directory.
3. Open `http://localhost:[port]` in your browser.

## Modernization Workflow (Future)
Once initialized with Bun/Hono:
- **Install dependencies**: `bun install`
- **Development**: `bun run dev`
- **Build**: `bun run build`

## Code Standards
- Maintain the "feel" and "colors" of the existing site.
- Use **HTMX** for dynamic interactions.
- Use **Hono** for routing and JSX-based templates.
