# Umpossible - Implementation Plan

> Detailed plan with autonomous, granular tasks

## Decisions

| Topic | Decision |
|-------|----------|
| Project Structure | Monorepo (/frontend, /backend, /shared) |
| Package Manager | Yarn 4 (Berry) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Admin Auth | Session-based with PostgreSQL store |
| Shared Types | Yes, in /shared folder |
| Docker | Dev-optimized with hot-reload |
| Linting | Strict (ESLint + Prettier) |
| Initial Data | Seed file |
| Admin Password | Generate and store in `.env` |
| Privacy Policy | Create GDPR-compliant German text |
| Favicon | Emoji in browser tab (🤪) |
| OG Image | Omit |

---

## Phase 0: Prerequisites

### 0.1 Verify Local Tools

- [ ] **T-0.1.1** Verify Docker is installed (`docker --version`)
- [ ] **T-0.1.2** Verify Docker Compose is installed (`docker compose version`)
- [ ] **T-0.1.3** Verify Node.js 20+ is installed (`node --version`)
- [ ] **T-0.1.4** Enable Corepack (`corepack enable`)

---

## Phase 1: Project Setup

### 1.1 Monorepo Base Structure

- [ ] **T-1.1.1** Initialize Yarn 4 (`yarn init -2`)
- [ ] **T-1.1.2** Configure workspaces in `package.json`:
  ```json
  {
    "workspaces": ["frontend", "backend", "shared"]
  }
  ```
- [ ] **T-1.1.3** Create `.yarnrc.yml` with nodeLinker: node-modules
- [ ] **T-1.1.4** Create folder structure: `/frontend`, `/backend`, `/shared`
- [ ] **T-1.1.5** Create `.gitignore` (node_modules, dist, .env, .yarn/cache)

### 1.2 TypeScript Configuration

- [ ] **T-1.2.1** Create root `tsconfig.json` as base config
- [ ] **T-1.2.2** Create `/shared/tsconfig.json` (extends root)
- [ ] **T-1.2.3** Create `/backend/tsconfig.json` (extends root, Node-specific)
- [ ] **T-1.2.4** Create `/frontend/tsconfig.json` (extends root, DOM-specific)
- [ ] **T-1.2.5** Enable strict TypeScript options (strict, noUncheckedIndexedAccess, etc.)

### 1.3 ESLint + Prettier

- [ ] **T-1.3.1** Install ESLint 9 with flat config
- [ ] **T-1.3.2** Create `eslint.config.js` with TypeScript parser
- [ ] **T-1.3.3** Install Prettier and create `.prettierrc`
- [ ] **T-1.3.4** Configure ESLint-Prettier integration
- [ ] **T-1.3.5** Create `.prettierignore`
- [ ] **T-1.3.6** Add npm scripts: `lint`, `lint:fix`, `format`

### 1.4 Shared Package

- [ ] **T-1.4.1** Create `/shared/package.json`
- [ ] **T-1.4.2** Create `/shared/src/index.ts` as entry point
- [ ] **T-1.4.3** Create `/shared/src/types/quote.ts` - Define Quote interface
- [ ] **T-1.4.4** Create `/shared/src/types/vote.ts` - Define Vote interface
- [ ] **T-1.4.5** Create `/shared/src/types/api.ts` - API request/response types
- [ ] **T-1.4.6** Create `/shared/src/constants.ts` - Shared constants (limits, etc.)

---

## Phase 2: Docker Environment

### 2.1 Docker Compose

- [ ] **T-2.1.1** Create `docker-compose.yml` with services: postgres, backend, frontend
- [ ] **T-2.1.2** Configure PostgreSQL service (port 5432, volume for data)
- [ ] **T-2.1.3** Configure backend service with volume mounts for hot-reload
- [ ] **T-2.1.4** Configure frontend service with volume mounts for hot-reload
- [ ] **T-2.1.5** Configure network between services
- [ ] **T-2.1.6** Create `.env.example` with all environment variables
- [ ] **T-2.1.7** Create `.env` with generated admin password (secure 32-character password)

### 2.2 Dockerfiles

- [ ] **T-2.2.1** Create `/backend/Dockerfile.dev` (Node.js, nodemon)
- [ ] **T-2.2.2** Create `/frontend/Dockerfile.dev` (Node.js, Vite dev server)
- [ ] **T-2.2.3** Create `.dockerignore`

### 2.3 Initialization Scripts

- [ ] **T-2.3.1** Create `scripts/setup.sh` - Initial setup (yarn install, copy env)
- [ ] **T-2.3.2** Create `scripts/dev.sh` - Start docker-compose with logs
- [ ] **T-2.3.3** Create `scripts/reset-db.sh` - Delete DB and run migrations/seed

---

## Phase 3: Backend Foundation

### 3.1 Express Setup

- [ ] **T-3.1.1** Create `/backend/package.json` with dependencies
- [ ] **T-3.1.2** Install Express.js with TypeScript types
- [ ] **T-3.1.3** Create `/backend/src/index.ts` - Server entry point
- [ ] **T-3.1.4** Create `/backend/src/app.ts` - Configure Express app
- [ ] **T-3.1.5** Add middleware: JSON body parser
- [ ] **T-3.1.6** Add middleware: CORS configuration (localhost:5173)
- [ ] **T-3.1.7** Add middleware: Cookie parser
- [ ] **T-3.1.8** Add health check endpoint: `GET /api/health`

### 3.2 Prisma Setup

- [ ] **T-3.2.1** Install Prisma CLI and client
- [ ] **T-3.2.2** Run `prisma init`
- [ ] **T-3.2.3** Define Quote model in `/backend/prisma/schema.prisma`
- [ ] **T-3.2.4** Define Vote model in `/backend/prisma/schema.prisma`
- [ ] **T-3.2.5** Define Session model for admin auth in `/backend/prisma/schema.prisma`
- [ ] **T-3.2.6** Add unique constraint for (quote_id, session_id) on Vote
- [ ] **T-3.2.7** Define indexes (votes for sorting, season/episode for filtering)
- [ ] **T-3.2.8** Create `/backend/src/lib/prisma.ts` - Prisma client singleton

### 3.3 Database Migrations

- [ ] **T-3.3.1** Create initial migration: `prisma migrate dev --name init`
- [ ] **T-3.3.2** Create `/backend/prisma/seed.ts`
- [ ] **T-3.3.3** Research and add 50 Ralph Wiggum quotes as seed data
- [ ] **T-3.3.4** Configure `prisma db seed` command in package.json

### 3.4 Logging

- [ ] **T-3.4.1** Install Pino logger
- [ ] **T-3.4.2** Create `/backend/src/lib/logger.ts` - Configure logger (JSON format)
- [ ] **T-3.4.3** Add request logging middleware (pino-http)
- [ ] **T-3.4.4** Make log levels configurable via environment variable

### 3.5 Error Handling

- [ ] **T-3.5.1** Create `/backend/src/lib/errors.ts` - Custom error classes (AppError, NotFoundError, etc.)
- [ ] **T-3.5.2** Create `/backend/src/middleware/errorHandler.ts` - Global error handler
- [ ] **T-3.5.3** Create async wrapper for route handlers (eliminate try/catch)
- [ ] **T-3.5.4** Add 404 handler for unknown routes

---

## Phase 4: Backend API - Public

### 4.1 Quote Routes

- [ ] **T-4.1.1** Create `/backend/src/routes/quotes.ts` - Router
- [ ] **T-4.1.2** Implement `GET /api/quotes/random` - Random quote
- [ ] **T-4.1.3** Implement `GET /api/quotes/:id` - Single quote by ID
- [ ] **T-4.1.4** Implement `GET /api/quotes` - List with pagination (page, limit)
- [ ] **T-4.1.5** Implement `GET /api/quotes` - Filter by season (query param)
- [ ] **T-4.1.6** Implement `GET /api/quotes` - Filter by episode (query param)
- [ ] **T-4.1.7** Implement `GET /api/quotes` - Sorting by votes (asc/desc)
- [ ] **T-4.1.8** Add input validation with Zod for all endpoints

### 4.2 Quote Services

- [ ] **T-4.2.1** Create `/backend/src/services/quoteService.ts`
- [ ] **T-4.2.2** Implement `getRandomQuote()` - Random quote from DB
- [ ] **T-4.2.3** Implement `getQuoteById(id)` - Single quote
- [ ] **T-4.2.4** Implement `getQuotes(filters, pagination, sort)` - Filtered list
- [ ] **T-4.2.5** Write unit tests for QuoteService

### 4.3 Vote Routes

- [ ] **T-4.3.1** Create `/backend/src/routes/votes.ts` - Router
- [ ] **T-4.3.2** Implement `POST /api/quotes/:id/vote` - Submit upvote
- [ ] **T-4.3.3** Read session ID from cookie or generate new one
- [ ] **T-4.3.4** Check if already voted (return 409 Conflict)
- [ ] **T-4.3.5** Increment vote count on quote (transaction)

### 4.4 Vote Services

- [ ] **T-4.4.1** Create `/backend/src/services/voteService.ts`
- [ ] **T-4.4.2** Implement `createVote(quoteId, sessionId)` - Create vote
- [ ] **T-4.4.3** Implement `hasVoted(quoteId, sessionId)` - Check if already voted
- [ ] **T-4.4.4** Implement `getVotedQuoteIds(sessionId)` - All voted quote IDs
- [ ] **T-4.4.5** Write unit tests for VoteService

### 4.5 Session Management (Visitor)

- [ ] **T-4.5.1** Create `/backend/src/middleware/sessionMiddleware.ts`
- [ ] **T-4.5.2** Set session ID cookie if not present (uuid)
- [ ] **T-4.5.3** Configure cookie options: httpOnly, sameSite, maxAge (1 year)
- [ ] **T-4.5.4** Make session ID available in request object

---

## Phase 5: Backend API - Admin

### 5.1 Admin Authentication

- [ ] **T-5.1.1** Create `/backend/src/routes/admin/auth.ts` - Auth router
- [ ] **T-5.1.2** Implement `POST /api/admin/login` - Login with password
- [ ] **T-5.1.3** Verify password against environment variable
- [ ] **T-5.1.4** Install express-session with connect-pg-simple
- [ ] **T-5.1.5** Add session store table to Prisma schema
- [ ] **T-5.1.6** Create session after successful login
- [ ] **T-5.1.7** Implement `POST /api/admin/logout` - Destroy session
- [ ] **T-5.1.8** Implement `GET /api/admin/me` - Check current auth status

### 5.2 Admin Middleware

- [ ] **T-5.2.1** Create `/backend/src/middleware/adminAuth.ts`
- [ ] **T-5.2.2** Check session for isAdmin flag
- [ ] **T-5.2.3** Return 401 Unauthorized for missing/invalid session

### 5.3 Admin Quote Management

- [ ] **T-5.3.1** Create `/backend/src/routes/admin/quotes.ts` - Admin quote router
- [ ] **T-5.3.2** Implement `GET /api/admin/quotes` - All quotes (with votes)
- [ ] **T-5.3.3** Implement `POST /api/admin/quotes` - Create new quote
- [ ] **T-5.3.4** Implement `PUT /api/admin/quotes/:id` - Edit quote
- [ ] **T-5.3.5** Implement `DELETE /api/admin/quotes/:id` - Delete quote (cascade votes)
- [ ] **T-5.3.6** Add input validation with Zod for all admin endpoints

### 5.4 Admin Services

- [ ] **T-5.4.1** Create `/backend/src/services/adminQuoteService.ts`
- [ ] **T-5.4.2** Implement `createQuote(data)` - New quote
- [ ] **T-5.4.3** Implement `updateQuote(id, data)` - Update quote
- [ ] **T-5.4.4** Implement `deleteQuote(id)` - Delete quote and associated votes
- [ ] **T-5.4.5** Write unit tests for AdminQuoteService

---

## Phase 6: Frontend Foundation

### 6.1 Vite + React Setup

- [ ] **T-6.1.1** Create `/frontend/package.json`
- [ ] **T-6.1.2** Initialize Vite with React-TS template
- [ ] **T-6.1.3** Install and configure Tailwind CSS
- [ ] **T-6.1.4** Configure `/frontend/tailwind.config.js` - Simpsons color palette
- [ ] **T-6.1.5** Create `/frontend/src/index.css` - Tailwind directives + base styles
- [ ] **T-6.1.6** Configure Vite proxy for `/api` to backend

### 6.2 Frontend Project Structure

- [ ] **T-6.2.1** Create `/frontend/src/components/` folder
- [ ] **T-6.2.2** Create `/frontend/src/pages/` folder
- [ ] **T-6.2.3** Create `/frontend/src/hooks/` folder
- [ ] **T-6.2.4** Create `/frontend/src/lib/` folder
- [ ] **T-6.2.5** Create `/frontend/src/types/` - Re-export shared types

### 6.3 API Client

- [ ] **T-6.3.1** Create `/frontend/src/lib/api.ts` - Fetch wrapper
- [ ] **T-6.3.2** Configure base URL (Vite env)
- [ ] **T-6.3.3** Add error handling (throw on non-2xx)
- [ ] **T-6.3.4** Implement `api.quotes.getRandom()` - Random quote
- [ ] **T-6.3.5** Implement `api.quotes.getById(id)` - Single quote
- [ ] **T-6.3.6** Implement `api.quotes.getList(params)` - Quote list
- [ ] **T-6.3.7** Implement `api.quotes.vote(id)` - Upvote
- [ ] **T-6.3.8** Implement `api.admin.*` - Admin API functions

### 6.4 Routing

- [ ] **T-6.4.1** Install React Router
- [ ] **T-6.4.2** Create `/frontend/src/App.tsx` - Router setup
- [ ] **T-6.4.3** Add route: `/` - Home
- [ ] **T-6.4.4** Add route: `/quote/:id` - Single quote
- [ ] **T-6.4.5** Add route: `/quotes` - Quote list
- [ ] **T-6.4.6** Add route: `/admin` - Admin login
- [ ] **T-6.4.7** Add route: `/admin/quotes` - Admin quotes
- [ ] **T-6.4.8** Add route: `/privacy` - Privacy policy
- [ ] **T-6.4.9** Add 404 route for unknown paths

---

## Phase 7: Frontend - Home Page

### 7.1 Layout Components

- [ ] **T-7.1.1** Create `/frontend/src/components/Layout.tsx` - Main layout
- [ ] **T-7.1.2** Create `/frontend/src/components/Header.tsx` - Navigation
- [ ] **T-7.1.3** Create `/frontend/src/components/Footer.tsx` - Footer with links
- [ ] **T-7.1.4** Create `/frontend/src/components/SkipLink.tsx` - Skip to content
- [ ] **T-7.1.5** Add responsive navigation (mobile hamburger menu)

### 7.2 Theme & Dark Mode

- [ ] **T-7.2.1** Create `/frontend/src/hooks/useTheme.ts` - Theme hook
- [ ] **T-7.2.2** Detect system preference (prefers-color-scheme)
- [ ] **T-7.2.3** Store manual preference in localStorage
- [ ] **T-7.2.4** Create `/frontend/src/components/ThemeToggle.tsx` - Toggle button
- [ ] **T-7.2.5** Add CSS variables for light/dark theme in tailwind.config.js

### 7.3 Home Page

- [ ] **T-7.3.1** Create `/frontend/src/pages/Home.tsx` - Page component
- [ ] **T-7.3.2** Create `/frontend/src/components/QuoteCard.tsx` - Quote display
- [ ] **T-7.3.3** Fetch random quote on page load
- [ ] **T-7.3.4** Add "New Quote" button with animation
- [ ] **T-7.3.5** Display season/episode
- [ ] **T-7.3.6** Display vote count
- [ ] **T-7.3.7** Add loading state during fetch

### 7.4 Voting UI

- [ ] **T-7.4.1** Create `/frontend/src/components/VoteButton.tsx` - Upvote button
- [ ] **T-7.4.2** Implement optimistic UI update on vote
- [ ] **T-7.4.3** Add visual feedback when already voted
- [ ] **T-7.4.4** Handle vote errors
- [ ] **T-7.4.5** Create `/frontend/src/hooks/useVotedQuotes.ts` - Local state for voted quotes

### 7.5 Share Function

- [ ] **T-7.5.1** Create `/frontend/src/components/ShareButton.tsx` - Share button
- [ ] **T-7.5.2** Use Clipboard API for "copy link"
- [ ] **T-7.5.3** Show toast/notification on successful copy
- [ ] **T-7.5.4** Create `/frontend/src/components/Toast.tsx` - Toast component

---

## Phase 8: Frontend - Quote List

### 8.1 List Page

- [ ] **T-8.1.1** Create `/frontend/src/pages/Quotes.tsx` - Page component
- [ ] **T-8.1.2** Create `/frontend/src/components/QuoteListItem.tsx` - List item
- [ ] **T-8.1.3** Load quotes with pagination
- [ ] **T-8.1.4** Add infinite scroll or "load more" button

### 8.2 Filter & Sorting

- [ ] **T-8.2.1** Create `/frontend/src/components/QuoteFilters.tsx` - Filter UI
- [ ] **T-8.2.2** Add season dropdown filter
- [ ] **T-8.2.3** Add episode dropdown filter (dependent on season)
- [ ] **T-8.2.4** Add sorting toggle (votes ascending/descending)
- [ ] **T-8.2.5** Sync filter/sort state with URL query params
- [ ] **T-8.2.6** Add reset filters button

### 8.3 Interactions

- [ ] **T-8.3.1** Enable voting directly from list
- [ ] **T-8.3.2** Click on quote opens detail view
- [ ] **T-8.3.3** Add loading states for filter changes

---

## Phase 9: Frontend - Admin

### 9.1 Admin Login

- [ ] **T-9.1.1** Create `/frontend/src/pages/AdminLogin.tsx` - Login page
- [ ] **T-9.1.2** Add password input with show/hide toggle
- [ ] **T-9.1.3** Implement login form submit
- [ ] **T-9.1.4** Show error message for wrong password
- [ ] **T-9.1.5** Redirect to /admin/quotes after login

### 9.2 Admin Auth State

- [ ] **T-9.2.1** Create `/frontend/src/hooks/useAdminAuth.ts` - Auth hook
- [ ] **T-9.2.2** Check auth status on app start
- [ ] **T-9.2.3** Create `/frontend/src/components/AdminRoute.tsx` - Protected route
- [ ] **T-9.2.4** Redirect to login if not authenticated
- [ ] **T-9.2.5** Implement logout function

### 9.3 Admin Quote Management

- [ ] **T-9.3.1** Create `/frontend/src/pages/AdminQuotes.tsx` - Overview
- [ ] **T-9.3.2** Display table with all quotes
- [ ] **T-9.3.3** Add sorting by votes, created, etc.
- [ ] **T-9.3.4** Add "New Quote" button
- [ ] **T-9.3.5** Add edit/delete buttons per row

### 9.4 Quote CRUD UI

- [ ] **T-9.4.1** Create `/frontend/src/components/QuoteForm.tsx` - Form
- [ ] **T-9.4.2** Add fields: text (textarea), season (number), episode (number)
- [ ] **T-9.4.3** Add client-side validation
- [ ] **T-9.4.4** Create `/frontend/src/components/QuoteModal.tsx` - Modal for create/edit
- [ ] **T-9.4.5** Add confirmation dialog for delete
- [ ] **T-9.4.6** Show success/error feedback after actions

---

## Phase 10: Accessibility

### 10.1 Keyboard Navigation

- [ ] **T-10.1.1** Ensure all interactive elements are reachable via Tab
- [ ] **T-10.1.2** Verify logical focus order
- [ ] **T-10.1.3** Add visible focus indicators (Tailwind ring)
- [ ] **T-10.1.4** Escape closes modals
- [ ] **T-10.1.5** Enter/Space activates buttons

### 10.2 Screen Reader

- [ ] **T-10.2.1** Add ARIA labels for all buttons without text
- [ ] **T-10.2.2** Add ARIA live regions for dynamic updates
- [ ] **T-10.2.3** Use semantic headings (h1, h2, h3)
- [ ] **T-10.2.4** Add alt text for all images (if any)
- [ ] **T-10.2.5** Add ARIA roles for navigation, main, etc.

### 10.3 Additional A11y

- [ ] **T-10.3.1** Verify color contrast (axe-core)
- [ ] **T-10.3.2** Test text zoom up to 200% without issues
- [ ] **T-10.3.3** Respect reduced motion preference (prefers-reduced-motion)
- [ ] **T-10.3.4** Ensure touch targets are at least 44x44px

---

## Phase 11: SEO & Meta

### 11.1 Meta Tags

- [ ] **T-11.1.1** Create `/frontend/src/components/SEO.tsx` - Helmet component
- [ ] **T-11.1.2** Set dynamic title tag per page
- [ ] **T-11.1.3** Set meta description per page
- [ ] **T-11.1.4** Add Open Graph tags (og:title, og:description, og:image)
- [ ] **T-11.1.5** Add Twitter Card meta tags
- [ ] **T-11.1.6** Add canonical URLs

### 11.2 Structured Data

- [ ] **T-11.2.1** Add JSON-LD for quotes (Quotation schema)
- [ ] **T-11.2.2** Integrate JSON-LD in QuoteCard

### 11.3 Static Files

- [ ] **T-11.3.1** Create `/frontend/public/robots.txt`
- [ ] **T-11.3.2** Generate sitemap.xml (or create manually)
- [ ] **T-11.3.3** Add emoji favicon: 🤪 as SVG favicon in `/frontend/index.html`
- [ ] ~~**T-11.3.4** Create OG image~~ *(skipped - no OG image)*

---

## Phase 12: Privacy

### 12.1 Cookie Banner

- [ ] **T-12.1.1** Create `/frontend/src/components/CookieBanner.tsx`
- [ ] **T-12.1.2** Store consent status in localStorage
- [ ] **T-12.1.3** Enable voting only with cookie consent
- [ ] **T-12.1.4** Close banner after consent

### 12.2 Legal Pages

- [ ] **T-12.2.1** Create `/frontend/src/pages/Privacy.tsx` - Privacy policy
- [ ] **T-12.2.2** Create GDPR-compliant German privacy text:
  - Controller (placeholder for contact details)
  - Session cookie explanation (purpose: voting, duration: 1 year)
  - No sharing with third parties
  - Data subject rights (access, deletion, etc.)
  - No tracking cookies, no analytics

---

## Phase 13: Security

### 13.1 Backend Security

- [ ] **T-13.1.1** Install Helmet.js for security headers
- [ ] **T-13.1.2** Configure Content-Security-Policy
- [ ] **T-13.1.3** Add rate limiting for API endpoints (express-rate-limit)
- [ ] **T-13.1.4** Add stricter rate limiting for vote endpoint
- [ ] **T-13.1.5** Review input sanitization

### 13.2 CORS & Cookies

- [ ] **T-13.2.1** Restrict CORS origin to frontend URL
- [ ] **T-13.2.2** Set cookie secure flag in production
- [ ] **T-13.2.3** Set SameSite cookie attribute

---

## Phase 14: Testing

### 14.1 Backend Unit Tests

- [ ] **T-14.1.1** Configure Vitest for backend
- [ ] **T-14.1.2** Write tests for QuoteService
- [ ] **T-14.1.3** Write tests for VoteService
- [ ] **T-14.1.4** Write tests for AdminQuoteService
- [ ] **T-14.1.5** Write tests for middleware (session, auth)

### 14.2 Backend Integration Tests

- [ ] **T-14.2.1** Install Supertest
- [ ] **T-14.2.2** Set up test database (Docker)
- [ ] **T-14.2.3** Write tests for quote endpoints
- [ ] **T-14.2.4** Write tests for vote endpoints
- [ ] **T-14.2.5** Write tests for admin endpoints

### 14.3 Frontend Tests

- [ ] **T-14.3.1** Configure Vitest + React Testing Library
- [ ] **T-14.3.2** Write tests for QuoteCard component
- [ ] **T-14.3.3** Write tests for VoteButton component
- [ ] **T-14.3.4** Write tests for QuoteFilters component
- [ ] **T-14.3.5** Write tests for useTheme hook

### 14.4 E2E Tests

- [ ] **T-14.4.1** Install and configure Playwright
- [ ] **T-14.4.2** E2E: Load home page and display quote
- [ ] **T-14.4.3** E2E: Load new quote
- [ ] **T-14.4.4** E2E: Submit upvote
- [ ] **T-14.4.5** E2E: Filter and sort quote list
- [ ] **T-14.4.6** E2E: Admin login and create quote
- [ ] **T-14.4.7** E2E: Dark mode toggle
- [ ] **T-14.4.8** E2E: Accessibility tests (axe-core)

---

## Phase 15: Performance & Polishing

### 15.1 Performance

- [ ] **T-15.1.1** Analyze bundle size (vite-plugin-visualizer)
- [ ] **T-15.1.2** Add code-splitting for admin routes
- [ ] **T-15.1.3** Add lazy loading for images (if any)
- [ ] **T-15.1.4** Run Lighthouse audit
- [ ] **T-15.1.5** Fix performance issues until score > 90

### 15.2 Final Polish

- [ ] **T-15.2.1** Add loading skeletons for better UX
- [ ] **T-15.2.2** Add error boundaries for error handling
- [ ] **T-15.2.3** Design 404 page
- [ ] **T-15.2.4** Fine-tune animations and transitions
- [ ] **T-15.2.5** Cross-browser testing (Chrome, Firefox, Safari)
- [ ] **T-15.2.6** Mobile testing on real devices

---

## Phase 16: Documentation & Completion

### 16.1 Project Documentation

- [ ] **T-16.1.1** `README.md` - Project overview, features, screenshots
- [ ] **T-16.1.2** `README.md` - Setup guide (prerequisites, installation, start)
- [ ] **T-16.1.3** `README.md` - Available scripts (dev, test, lint, etc.)
- [ ] **T-16.1.4** `docs/ARCHITECTURE.md` - Folder structure with descriptions
- [ ] **T-16.1.5** `docs/ARCHITECTURE.md` - Component overview (frontend)
- [ ] **T-16.1.6** `docs/ARCHITECTURE.md` - Service overview (backend)
- [ ] **T-16.1.7** `docs/API.md` - All endpoints with request/response examples
- [ ] **T-16.1.8** `.env.example` - All variables with description comments

### 16.2 Code Documentation

- [ ] **T-16.2.1** Add JSDoc for all service functions (backend)
- [ ] **T-16.2.2** Add JSDoc for all custom hooks (frontend)
- [ ] **T-16.2.3** Add JSDoc for all utility functions
- [ ] **T-16.2.4** Add `/** */` comments to TypeScript interfaces
- [ ] **T-16.2.5** Add inline comments for complex algorithms/logic
- [ ] **T-16.2.6** Create README.md in `/shared` - Description of shared types

### 16.3 Acceptance

- [ ] **T-16.3.1** Verify all functional requirements (F-*) are implemented
- [ ] **T-16.3.2** Verify all non-functional requirements (NFA-*) are fulfilled
- [ ] **T-16.3.3** Verify Lighthouse score > 90
- [ ] **T-16.3.4** Verify docker-compose up starts successfully
- [ ] **T-16.3.5** Verify seed data is loaded

---

*Plan created: January 2026*
*Estimated tasks: ~200*
