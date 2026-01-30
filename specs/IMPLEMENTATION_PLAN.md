# Umpossible - Implementation Plan

> Remaining tasks only - completed items have been removed

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
| Favicon | Emoji in browser tab |
| OG Image | Omit |

---

## Completed Phases (Summary)

The following phases are **fully implemented**:

- **Phase 0:** Prerequisites (Docker, Node, Corepack)
- **Phase 1:** Project Setup (Monorepo, TypeScript, ESLint/Prettier, Shared types)
- **Phase 2:** Docker Environment (docker-compose, Dockerfiles, scripts, env files) - *Bug fixed: Tailwind config files now copied to container*
- **Phase 3:** Backend Foundation (Express, Prisma, migrations, logging, errors)
- **Phase 4:** Backend API - Public (Quote routes, services, vote functionality)
- **Phase 5:** Backend API - Admin (Auth, CRUD operations, middleware)
- **Phase 6:** Frontend Foundation (Vite, React, Tailwind, Routing, API client)
- **Phase 7:** Frontend Home Page (Layout, Theme, QuoteCard, Voting, Share)
- **Phase 8:** Frontend Quote List (List view, Filters, Pagination, Dynamic episode filter)
- **Phase 9:** Frontend Admin (Login, Dashboard, CRUD UI)
- **Phase 10:** Accessibility (Keyboard nav, ARIA, Skip links, Focus indicators)
- **Phase 11:** SEO & Meta (Meta tags, JSON-LD, robots.txt, sitemap, favicon)
- **Phase 12:** Privacy (Cookie banner, Privacy policy page)
- **Phase 13:** Security (Helmet, Rate limiting, CORS, Validation)
- **Phase 14:** Testing (Unit tests, Component tests, E2E tests with axe-core accessibility)
- **Phase 16:** Documentation (README, ARCHITECTURE.md, API.md, .env.example)

---

## Remaining Tasks

### Phase 14: Testing (Complete)

> Backend and frontend tests complete.

#### 14.3 Frontend Component Tests (Complete)

- [x] **T-14.3.4** ~~Write tests for QuoteFilters component~~ (N/A - filters inline in Quotes page)
- [x] **T-14.3.5** Write tests for useTheme hook
- [x] **T-14.3.6** Write tests for Layout component
- [x] **T-14.3.7** Write tests for Header component
- [x] **T-14.3.8** Write tests for Footer component
- [x] **T-14.3.9** Write tests for CookieBanner component
- [x] **T-14.3.10** Write tests for ThemeToggle component
- [x] **T-14.3.11** ~~Write tests for Toast component~~ (N/A - component does not exist)
- [x] **T-14.3.12** Write tests for SkipLink component
- [x] **T-14.3.13** Write tests for ConfirmDialog component
- [x] **T-14.3.14** Write tests for QuoteForm component
- [x] **T-14.3.15** Write tests for QuoteModal component
- [x] **T-14.3.16** Write tests for AdminRoute component
- [x] **T-14.3.17** Write tests for ErrorBoundary component
- [x] **T-14.3.18** Write tests for SEO component
- [x] **T-14.3.19** Write tests for useAdminAuth hook
- [x] **T-14.3.20** Write tests for useCookieConsent hook
- [x] **T-14.3.21** Write tests for useVotedQuotes hook

#### 14.4 E2E Tests (Complete)

- [x] **T-14.4.8** E2E: Accessibility tests with axe-core integration

---

### Phase 15: Performance & Polishing

> Not yet started

#### 15.1 Performance

- [ ] **T-15.1.1** Analyze bundle size with vite-plugin-visualizer
- [ ] **T-15.1.2** Add code-splitting for admin routes (lazy loading)
- [ ] **T-15.1.4** Run Lighthouse audit
- [ ] **T-15.1.5** Fix performance issues until Lighthouse score > 90

#### 15.2 Final Polish

- [ ] **T-15.2.1** Add loading skeletons for better UX
- [ ] **T-15.2.4** Fine-tune animations and transitions
- [ ] **T-15.2.5** Cross-browser testing (Chrome, Firefox, Safari)
- [ ] **T-15.2.6** Mobile testing on real devices

---

### Phase 16: Acceptance Criteria Verification

> Final verification tasks

- [ ] **T-16.3.1** Verify all functional requirements (F-*) are implemented
- [ ] **T-16.3.2** Verify all non-functional requirements (NFA-*) are fulfilled
- [ ] **T-16.3.3** Verify Lighthouse score > 90
- [ ] **T-16.3.4** Verify docker-compose up starts successfully
- [ ] **T-16.3.5** Verify seed data is loaded

---

## Priority Order

Based on impact and dependencies, recommended order:

### High Priority (Core Functionality)
1. **T-15.1.2** Code-splitting for admin routes - improves bundle size
2. **T-15.1.4** Lighthouse audit - identifies issues
3. **T-15.1.5** Fix performance issues

### Medium Priority (Quality Assurance)
4. ~~**T-14.4.8** E2E accessibility tests with axe-core~~ (Complete)
5. ~~**T-14.3.x** Frontend component tests~~ (Complete - 152 tests passing)
6. **T-16.3.x** Final acceptance verification

### Lower Priority (Polish)
7. **T-15.2.1** Loading skeletons
8. **T-15.2.4** Animations fine-tuning
9. **T-15.2.5** Cross-browser testing
10. **T-15.2.6** Mobile device testing

---

## Most Important Next Step

**T-15.1.2: Add code-splitting for admin routes**

This task should be tackled first because:
1. Reduces initial bundle size for regular users
2. Admin routes are not needed for most visitors
3. Easy to implement with React.lazy()
4. Directly impacts NFA-PERF-01 (bundle < 150 KB)

---

*Plan updated: January 2026*
*Remaining tasks: ~11*
