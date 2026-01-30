# Umpossible - Specification

> "Me fail English? That's unpossible!" - Ralph Wiggum

## 1. Overview

**Umpossible** is a web application that displays quotes from Ralph Wiggum from "The Simpsons". The application serves as a small, fun pastime.

### 1.1 Goals

- Entertaining display of Ralph Wiggum quotes
- Simple, fast user experience
- Community engagement through voting system
- Accessible and responsive design

---

## 2. Functional Requirements

### 2.1 Home Page

| ID | Requirement |
|----|-------------|
| F-HOME-01 | A random quote is displayed when the page loads |
| F-HOME-02 | "New Quote" button loads a new random quote |
| F-HOME-03 | The current quote can be upvoted |
| F-HOME-04 | Share button copies the link to the current quote to clipboard |
| F-HOME-05 | Display of season and episode for the current quote |
| F-HOME-06 | Display of current vote count |

### 2.2 Quote List

| ID | Requirement |
|----|-------------|
| F-LIST-01 | List of all quotes with text, season, episode, and votes |
| F-LIST-02 | Sorting by number of votes (ascending/descending) |
| F-LIST-03 | Filter by season |
| F-LIST-04 | Filter by episode |
| F-LIST-05 | Combination of filters possible (season + episode) |
| F-LIST-06 | Upvote directly from the list possible |

### 2.3 Voting System

| ID | Requirement |
|----|-------------|
| F-VOTE-01 | Upvotes only (no downvotes) |
| F-VOTE-02 | Any visitor can vote (no registration required) |
| F-VOTE-03 | Protection against multiple voting via session ID in cookie |
| F-VOTE-04 | A user can upvote each quote at most once |
| F-VOTE-05 | Visual feedback when already voted |

### 2.4 Share Function

| ID | Requirement |
|----|-------------|
| F-SHARE-01 | "Copy link" button copies URL to quote |
| F-SHARE-02 | Direct link to a specific quote possible (e.g., `/quote/123`) |
| F-SHARE-03 | Visual feedback after successful copy |

### 2.5 Admin Area

| ID | Requirement |
|----|-------------|
| F-ADMIN-01 | Access protected by static password |
| F-ADMIN-02 | Create quotes (text, season, episode) |
| F-ADMIN-03 | Edit quotes |
| F-ADMIN-04 | Delete quotes |
| F-ADMIN-05 | Overview of all quotes with votes |

---

## 3. Data Model

### 3.1 Quote

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique ID |
| text | String | Quote text (English) |
| season | Integer | Season number (1-35+) |
| episode | Integer | Episode number |
| votes | Integer | Number of upvotes (default: 0) |
| created_at | Timestamp | Creation timestamp |
| updated_at | Timestamp | Last modification timestamp |

### 3.2 Vote

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique ID |
| quote_id | UUID | Reference to quote |
| session_id | String | Session ID from cookie |
| created_at | Timestamp | Timestamp of vote |

**Constraint:** Unique on (quote_id, session_id)

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement |
|----|-------------|
| NFA-PERF-01 | Initial JS bundle < 150 KB (gzipped) |
| NFA-PERF-02 | Time to First Contentful Paint < 2s |
| NFA-PERF-03 | Efficient database queries with indexes |

### 4.2 Security

| ID | Requirement |
|----|-------------|
| NFA-SEC-01 | HTTPS only (HTTP redirect to HTTPS) |
| NFA-SEC-02 | Content Security Policy (CSP) headers |
| NFA-SEC-03 | CORS configured (own domain only) |
| NFA-SEC-04 | SQL injection prevention (prepared statements) |
| NFA-SEC-05 | XSS prevention (input sanitization, output encoding) |
| NFA-SEC-06 | Admin password securely stored (environment variable) |

### 4.3 Accessibility

| ID | Requirement |
|----|-------------|
| NFA-A11Y-01 | WCAG 2.1 Level AA compliance |
| NFA-A11Y-02 | Keyboard navigation: All features usable without mouse |
| NFA-A11Y-03 | Screen reader support: ARIA labels for all interactive elements |
| NFA-A11Y-04 | Color contrast: Minimum 4.5:1 for normal text |
| NFA-A11Y-05 | Color contrast: Minimum 3:1 for large text and UI components |
| NFA-A11Y-06 | Focus indicators clearly visible |
| NFA-A11Y-07 | Skip links for main navigation |

### 4.4 SEO

| ID | Requirement |
|----|-------------|
| NFA-SEO-01 | Semantic HTML (h1, h2, main, nav, etc.) |
| NFA-SEO-02 | Meta tags (title, description, Open Graph) |
| NFA-SEO-03 | Structured data (JSON-LD for quotes) |
| NFA-SEO-04 | Canonical URLs |
| NFA-SEO-05 | Sitemap.xml |
| NFA-SEO-06 | robots.txt |

### 4.5 Privacy (GDPR)

| ID | Requirement |
|----|-------------|
| NFA-GDPR-01 | Cookie banner for session cookie |
| NFA-GDPR-02 | Privacy policy |
| NFA-GDPR-03 | No tracking cookies without consent |
| NFA-GDPR-04 | Session cookie only for voting functionality |

### 4.6 Logging

| ID | Requirement |
|----|-------------|
| NFA-LOG-01 | Structured logging (JSON format) |
| NFA-LOG-02 | Log levels: ERROR, WARN, INFO, DEBUG |
| NFA-LOG-03 | Request logging (method, path, status, duration) |
| NFA-LOG-04 | Error logging with stack traces |
| NFA-LOG-05 | No sensitive data in logs |

### 4.7 Documentation

| ID | Requirement |
|----|-------------|
| NFA-DOC-01 | README.md with project overview and setup guide |
| NFA-DOC-02 | Architecture documentation (folder structure, component overview) |
| NFA-DOC-03 | API documentation (endpoints, request/response examples) |
| NFA-DOC-04 | JSDoc comments for all public functions and services |
| NFA-DOC-05 | TypeScript interfaces with descriptive comments |
| NFA-DOC-06 | Inline comments for complex logic |
| NFA-DOC-07 | Environment variables documented in `.env.example` |

---

## 5. Design

### 5.1 Theme

- **Style:** Simpsons-inspired
- **Primary color:** Simpsons Yellow (#FFD90F)
- **Accent colors:** Sky blue, pink (Ralph's shirt)
- **Font:** Playful but readable (e.g., comic-like for headlines, sans-serif for body)

### 5.2 Dark Mode

| ID | Requirement |
|----|-------------|
| D-DARK-01 | Automatic detection of system preference |
| D-DARK-02 | Manual toggle to switch |
| D-DARK-03 | Preference saved in local storage |
| D-DARK-04 | Contrast ratios maintained in dark mode |

### 5.3 Responsive Design

| Breakpoint | Width | Description |
|------------|-------|-------------|
| Mobile | < 640px | Single column, touch-optimized |
| Tablet | 640px - 1024px | Adapted layout |
| Desktop | > 1024px | Full layout |

---

## 6. Technology Stack

### 6.1 Frontend

| Component | Technology |
|-----------|------------|
| Framework | React 18+ |
| Build Tool | Vite |
| Styling | CSS Modules or Tailwind CSS |
| HTTP Client | Fetch API |

### 6.2 Backend

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM/Query Builder | Prisma or Drizzle |

### 6.3 Testing

| Type | Technology |
|------|------------|
| Unit/Integration | Vitest |
| E2E | Playwright |
| Coverage | Vitest Coverage (c8/istanbul) |

### 6.4 Development

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Linting | ESLint |
| Formatting | Prettier |
| Package Manager | npm or pnpm |

---

## 7. Page Structure

```
/                     → Home page (random quote)
/quote/:id            → Direct link to specific quote
/quotes               → Quote list with filter/sorting
/admin                → Admin login
/admin/quotes         → Admin: Quote management
/privacy              → Privacy policy
/imprint              → Imprint (if required)
```

---

## 8. API Endpoints

### 8.1 Public API

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/quotes/random | Random quote |
| GET | /api/quotes/:id | Single quote |
| GET | /api/quotes | List of all quotes (with filter/sort) |
| POST | /api/quotes/:id/vote | Upvote for quote |

#### Query Parameters for GET /api/quotes

| Parameter | Type | Description |
|-----------|------|-------------|
| season | Integer | Filter by season |
| episode | Integer | Filter by episode |
| sort | String | Sorting: "votes_asc", "votes_desc" |
| page | Integer | Page number (pagination) |
| limit | Integer | Entries per page (default: 20) |

### 8.2 Admin API

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/admin/login | Admin login |
| GET | /api/admin/quotes | All quotes (admin view) |
| POST | /api/admin/quotes | Create quote |
| PUT | /api/admin/quotes/:id | Edit quote |
| DELETE | /api/admin/quotes/:id | Delete quote |

---

## 9. Local Development

The application is run exclusively locally with Docker Compose.

| Component | Container |
|-----------|-----------|
| Frontend + Backend | Node.js container |
| PostgreSQL | PostgreSQL container |

### 9.1 Start

```bash
docker-compose up
```

---

## 10. Initial Data

During implementation, Ralph Wiggum quotes will be researched and provided as seed data.

**Sources:**
- Simpsons Wiki
- Episode transcripts
- Curated lists

**Estimated scope:** 50-100 quotes initially

---

## 11. Open Items

| ID | Topic | Status |
|----|-------|--------|
| OP-01 | Exact color palette for dark mode | In design process |
| OP-02 | Imprint required? | Legal clarification |

---

## 12. Acceptance Criteria

The application is considered complete when:

- [ ] All functional requirements (F-*) are implemented
- [ ] All non-functional requirements (NFA-*) are fulfilled
- [ ] E2E tests and integration tests exist and pass
- [ ] Lighthouse score > 90 for performance, accessibility, SEO
- [ ] Application starts successfully with docker-compose
- [ ] Initial quotes are seeded

---

*Specification created: January 2026*
*Version: 1.3 - Local development with Docker Compose*
