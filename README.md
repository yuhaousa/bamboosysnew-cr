# BambooSys CMS

A modern, production-ready dynamic website management system built with Vue 3, Tailwind CSS, and Cloudflare's full-stack platform.

## Architecture

```
bamboosysnew-cr/
+-- apps/
¦   +-- admin/           # Vue 3 Admin Panel (Cloudflare Pages)
¦   +-- frontend/        # Vue 3 Public Website (Cloudflare Pages)
¦   +-- worker/          # Hono API (Cloudflare Workers)
+-- packages/
¦   +-- shared/          # Shared TypeScript types & constants
+-- migrations/          # Cloudflare D1 SQL migrations
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Admin UI | Vue 3 + Vite + TypeScript + Tailwind CSS 3 + Pinia |
| Frontend | Vue 3 + Vite + TypeScript + Tailwind CSS 3 |
| API | Cloudflare Workers + Hono |
| Database | Cloudflare D1 (SQLite) |
| File Storage | Cloudflare R2 |
| Authentication | Custom JWT (HS256 via Web Crypto API — no external service needed) |
| Drag & Drop | vue-draggable-plus |
| Rich Text | Tiptap |
| Package Manager | pnpm workspaces |

---

## Accounts Required

| Service | Required | Purpose | Cost |
|---------|----------|---------|------|
| [Cloudflare](https://cloudflare.com) | ? Yes | Workers, D1 database, R2 storage, Pages hosting | Free tier available |
| Clerk / any auth service | ? No | Auth is built-in using JWT | — |

> **No third-party auth service needed.** Login uses email + password stored in D1 with PBKDF2 hashed passwords and JWT tokens signed with your own secret key.

---

## Prerequisites

Install these on your machine before starting:

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **pnpm** — `npm install -g pnpm`
- **Wrangler CLI** — `npm install -g wrangler`
- A **Cloudflare account** (free) — [cloudflare.com](https://cloudflare.com)

---

## Setup (First Time)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser to authenticate with your Cloudflare account.

### 3. Create Cloudflare D1 database and R2 bucket

```bash
# Create database
npx wrangler d1 create bamboosys-db

# Create media storage bucket
npx wrangler r2 bucket create bamboosys-media
```

After creating the database, copy the `database_id` from the output and paste it into `apps/worker/wrangler.toml`:

```toml
[[d1_databases]]
database_id = "paste-your-id-here"
```

### 4. Run database migrations

```bash
npx wrangler d1 execute bamboosys-db --local --file=migrations/001_initial.sql
npx wrangler d1 execute bamboosys-db --local --file=migrations/002_add_password.sql
```

### 5. Set your admin credentials

Open `apps/worker/wrangler.toml` and update the `[vars]` section:

```toml
[vars]
JWT_SECRET     = "replace-with-a-random-32-char-string"
ADMIN_EMAIL    = "admin@yourdomain.com"
ADMIN_PASSWORD = "your-secure-password"
```

> **Tip:** Generate a secure JWT_SECRET:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

The admin account is **auto-created on your first login** using these credentials.

### 6. Run everything with one command

```bash
pnpm dev
```

| Service | URL |
|---------|-----|
| API (Worker) | http://localhost:8787 |
| Admin Panel | http://localhost:5174 |
| Frontend Website | http://localhost:5173 |

Login at **http://localhost:5174** using the email and password from `wrangler.toml`.

---

## Block Types (21 total)

| Block | Description |
|-------|-------------|
| `hero_banner` | Full hero with title, subtitle, image, CTA buttons |
| `image_left_content_right` | Two-column image + text |
| `content_left_image_right` | Two-column text + image |
| `centered_text` | Centered text with buttons |
| `feature_cards` | Grid of feature cards |
| `services_section` | Services with features list |
| `course_listing` | Course cards with pricing |
| `about_section` | About with highlights & stats |
| `gallery_section` | Image gallery with lightbox |
| `video_section` | YouTube/Vimeo/direct video |
| `testimonials` | Testimonial cards with star ratings |
| `faq` | Accordion FAQ |
| `call_to_action` | Call-to-action with background image |
| `statistics_counters` | Big number statistics |
| `team_section` | Team member grid |
| `pricing_section` | Pricing tiers with feature lists |
| `contact_section` | Contact info + contact form |
| `map_section` | Google Maps iframe embed |
| `newsletter_section` | Email subscription form |
| `rich_text` | Tiptap WYSIWYG content |
| `custom_html` | Raw HTML + CSS |

---

## Deployment to Cloudflare

### Deploy the API Worker

```bash
pnpm deploy:worker
```

For production, use secrets instead of plain `[vars]` in wrangler.toml:

```bash
npx wrangler secret put JWT_SECRET
npx wrangler secret put ADMIN_PASSWORD
```

### Deploy Admin Panel

```bash
cd apps/admin && pnpm build
```

Upload `apps/admin/dist/` to Cloudflare Pages. Set these environment variables in the Pages dashboard:

```
VITE_API_URL=https://your-worker.workers.dev
VITE_FRONTEND_URL=https://yoursite.pages.dev
```

### Deploy Frontend Website

```bash
cd apps/frontend && pnpm build
```

Upload `apps/frontend/dist/` to a separate Cloudflare Pages project. Set:

```
VITE_API_URL=https://your-worker.workers.dev
```

### Run production DB migrations

```bash
npx wrangler d1 execute bamboosys-db --remote --file=migrations/001_initial.sql
npx wrangler d1 execute bamboosys-db --remote --file=migrations/002_add_password.sql
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full access including user management |
| `admin` | Full content management |
| `editor` | Create/edit pages and media |

---

## API Endpoints

### Public (no auth required)
- `GET /api/public/pages/:slug` — Page + blocks by slug
- `GET /api/public/pages` — All published pages
- `GET /api/public/preview/:id?token=preview` — Preview draft page
- `GET /api/public/settings` — Site settings
- `GET /api/public/menus/:slug` — Menu by slug

### Auth
- `POST /api/auth/login` — Login with email + password, returns JWT token
- `GET /api/auth/me` — Get current user info

### Protected (requires `Authorization: Bearer <token>`)
- `/api/pages` — Page CRUD
- `/api/blocks/:pageId` — Block CRUD
- `/api/media` — Media management
- `/api/settings` — Settings management
- `/api/menus` — Menu management
- `/api/revisions/:pageId` — Page revisions
- `/api/users` — User management (admin+)
- `/api/audit` — Audit logs (admin+)
