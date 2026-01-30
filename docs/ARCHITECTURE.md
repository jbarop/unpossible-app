# Architecture

This document describes the architecture and structure of the Umpossible application.

## Overview

Umpossible is a Yarn 4 monorepo containing three workspaces:
- **backend**: Express.js REST API
- **frontend**: React SPA with Vite
- **shared**: Shared TypeScript types and constants

## Folder Structure

```
unpossible-app/
├── backend/                     # Express.js API server
│   ├── prisma/
│   │   ├── migrations/          # Database migrations
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Seed data (Ralph Wiggum quotes)
│   └── src/
│       ├── lib/                 # Shared utilities
│       │   ├── errors.ts        # Custom error classes
│       │   ├── logger.ts        # Pino logger configuration
│       │   └── prisma.ts        # Prisma client singleton
│       ├── middleware/          # Express middleware
│       │   ├── adminAuth.ts     # Admin route protection
│       │   ├── adminSessionMiddleware.ts  # Admin session handling
│       │   ├── errorHandler.ts  # Global error handler
│       │   ├── rateLimiter.ts   # Rate limiting configuration
│       │   └── sessionMiddleware.ts  # Visitor session (for voting)
│       ├── routes/              # API routes
│       │   ├── admin/
│       │   │   ├── auth.ts      # Admin login/logout
│       │   │   └── quotes.ts    # Admin CRUD operations
│       │   ├── health.ts        # Health check endpoint
│       │   ├── quotes.ts        # Public quote endpoints
│       │   └── votes.ts         # Voting endpoint
│       ├── services/            # Business logic
│       │   ├── adminQuoteService.ts  # Admin quote operations
│       │   ├── quoteService.ts  # Quote queries
│       │   └── voteService.ts   # Vote management
│       ├── test/                # Test utilities
│       ├── app.ts               # Express app configuration
│       └── index.ts             # Server entry point
│
├── frontend/                    # React application
│   ├── public/
│   │   ├── robots.txt           # SEO robots file
│   │   └── sitemap.xml          # SEO sitemap
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── AdminRoute.tsx   # Protected route wrapper
│       │   ├── ConfirmDialog.tsx  # Confirmation modal
│       │   ├── CookieBanner.tsx # GDPR cookie consent
│       │   ├── Footer.tsx       # Page footer
│       │   ├── Header.tsx       # Navigation header
│       │   ├── Layout.tsx       # Page layout wrapper
│       │   ├── QuoteCard.tsx    # Quote display card
│       │   ├── QuoteForm.tsx    # Quote create/edit form
│       │   ├── QuoteListItem.tsx  # Quote in list view
│       │   ├── QuoteModal.tsx   # Quote editing modal
│       │   ├── SEO.tsx          # Meta tags component
│       │   ├── ShareButton.tsx  # Copy link button
│       │   ├── SkipLink.tsx     # Accessibility skip link
│       │   ├── ThemeToggle.tsx  # Dark mode toggle
│       │   └── VoteButton.tsx   # Upvote button
│       ├── contexts/            # React contexts
│       │   └── CookieConsentContext.tsx  # Cookie consent state
│       ├── hooks/               # Custom React hooks
│       │   ├── useAdminAuth.ts  # Admin authentication
│       │   ├── useCookieConsent.ts  # Cookie consent
│       │   ├── useTheme.ts      # Dark mode
│       │   └── useVotedQuotes.ts  # Track voted quotes
│       ├── lib/                 # Utilities
│       │   └── api.ts           # API client
│       ├── pages/               # Page components
│       │   ├── AdminLogin.tsx   # Admin login page
│       │   ├── AdminQuotes.tsx  # Admin dashboard
│       │   ├── Home.tsx         # Random quote page
│       │   ├── NotFound.tsx     # 404 page
│       │   ├── Privacy.tsx      # Privacy policy
│       │   ├── QuoteDetail.tsx  # Single quote view
│       │   └── Quotes.tsx       # Quote list page
│       ├── App.tsx              # Router and app setup
│       ├── index.css            # Global styles
│       └── main.tsx             # Entry point
│
├── shared/                      # Shared TypeScript types
│   └── src/
│       ├── types/
│       │   ├── api.ts           # API response types
│       │   ├── quote.ts         # Quote interfaces
│       │   └── vote.ts          # Vote interfaces
│       ├── constants.ts         # Shared constants
│       └── index.ts             # Barrel export
│
├── e2e/                         # Playwright E2E tests
│   ├── admin.spec.ts            # Admin functionality tests
│   ├── dark-mode.spec.ts        # Theme toggle tests
│   ├── home.spec.ts             # Home page tests
│   ├── navigation.spec.ts       # Navigation tests
│   ├── quotes-list.spec.ts      # Quote list tests
│   └── voting.spec.ts           # Voting tests
│
├── scripts/                     # Utility scripts
│   ├── dev.sh                   # Start development environment
│   ├── reset-db.sh              # Reset and reseed database
│   └── setup.sh                 # Initial project setup
│
├── specs/                       # Specifications
│   ├── IMPLEMENTATION_PLAN.md   # Implementation tasks
│   └── SPECIFICATION.md         # Feature requirements
│
└── docs/                        # Documentation
    ├── API.md                   # API documentation
    └── ARCHITECTURE.md          # This file
```

## Data Model

### Quote

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| text | String | Quote text |
| season | Integer | The Simpsons season number |
| episode | Integer | Episode number within season |
| votes | Integer | Total upvote count |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Vote

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| quoteId | UUID | Foreign key to Quote |
| sessionId | String | Visitor session identifier |
| createdAt | DateTime | Vote timestamp |

**Constraint**: Unique on (quoteId, sessionId) - prevents double voting.

### AdminSession

Used for storing express-session data for admin authentication with PostgreSQL.

## Key Patterns

### Backend

- **Service Layer**: Business logic separated from route handlers
- **Async Handler**: Wrapper that catches errors and forwards to error handler
- **Zod Validation**: Input validation using Zod schemas
- **Custom Errors**: AppError base class with subclasses (NotFoundError, BadRequestError, etc.)
- **Session-Based Auth**: Admin uses session cookies stored in PostgreSQL

### Frontend

- **React Router**: Client-side routing with protected routes
- **Context API**: Used for cookie consent and theme state
- **Custom Hooks**: Encapsulate reusable logic (useTheme, useAdminAuth, etc.)
- **Optimistic Updates**: Vote button updates immediately before server confirmation

## Security

- **Helmet.js**: Security headers (CSP, HSTS, etc.)
- **Rate Limiting**: Prevents abuse of voting and API endpoints
- **CORS**: Configured for frontend origin only
- **Input Validation**: All inputs validated with Zod
- **SQL Injection Prevention**: Using Prisma ORM with parameterized queries

## Testing Strategy

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit | Vitest | Service logic with mocked database |
| Integration | Supertest | API endpoints with test database |
| Component | React Testing Library | UI component behavior |
| E2E | Playwright | Full user flows |

## Configuration

### Environment Variables

See `.env.example` for all configuration options. Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_PASSWORD`: Admin login password
- `SESSION_SECRET`: Secret for session encryption
- `LOG_LEVEL`: Pino log level (error/warn/info/debug)

### Docker Compose

Development environment runs three services:
1. **postgres**: PostgreSQL 16 database
2. **backend**: Express.js API with hot-reload (tsx watch)
3. **frontend**: Vite dev server with HMR

All services are connected via Docker network, with volume mounts for hot-reload support.
