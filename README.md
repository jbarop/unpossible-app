# Umpossible

> "Me fail English? That's unpossible!" - Ralph Wiggum

A web application that displays quotes from Ralph Wiggum from "The Simpsons". Built as a fun, community-driven quote browser with voting capabilities.

## Features

- **Random Quote Display**: Get a random Ralph Wiggum quote on page load
- **Quote Browsing**: View all quotes with filtering and sorting options
- **Voting System**: Upvote your favorite quotes (one vote per quote per session)
- **Share Quotes**: Copy direct links to quotes for sharing
- **Admin Dashboard**: Manage quotes (create, edit, delete) with password protection
- **Dark Mode**: Automatic system preference detection with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **GDPR Compliant**: Cookie consent banner and privacy policy

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL with Prisma ORM |
| Testing | Vitest, React Testing Library, Playwright |
| Infrastructure | Docker Compose |

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) 20 or later
- [Corepack](https://nodejs.org/api/corepack.html) enabled (`corepack enable`)

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd unpossible-app
   ```

2. **Run the setup script**:
   ```bash
   ./scripts/setup.sh
   ```
   This installs dependencies, copies the `.env.example` to `.env`, and generates secure secrets.

3. **Start the application**:
   ```bash
   ./scripts/dev.sh
   ```
   This starts PostgreSQL, backend, and frontend services with Docker Compose.

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

5. **Seed the database** (if not done automatically):
   ```bash
   docker compose exec backend yarn prisma db seed
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `unpossible` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `unpossible` |
| `POSTGRES_DB` | PostgreSQL database name | `unpossible` |
| `DATABASE_URL` | Full PostgreSQL connection string | (generated from above) |
| `ADMIN_PASSWORD` | Password for admin access | (generate a secure value) |
| `SESSION_SECRET` | Secret for session encryption | (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `LOG_LEVEL` | Logging level (`error`, `warn`, `info`, `debug`) | `debug` |
| `PORT` | Backend server port | `3000` |

## Project Structure

```
unpossible-app/
├── backend/           # Express.js API server
│   ├── prisma/        # Database schema and migrations
│   └── src/           # Source code
├── frontend/          # React application
│   ├── public/        # Static assets
│   └── src/           # Source code
├── shared/            # Shared TypeScript types
├── e2e/               # Playwright E2E tests
├── scripts/           # Utility scripts
├── docs/              # Documentation
└── specs/             # Specifications and plans
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed structure documentation.

## Available Scripts

### Root Level

| Script | Description |
|--------|-------------|
| `yarn lint` | Run ESLint across all workspaces |
| `yarn lint:fix` | Run ESLint with auto-fix |
| `yarn format` | Format code with Prettier |
| `yarn format:check` | Check code formatting |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn test:e2e` | Run Playwright E2E tests |
| `yarn test:e2e:ui` | Run E2E tests with interactive UI |

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot-reload |
| `yarn build` | Build for production |
| `yarn test` | Run unit and integration tests |
| `yarn prisma migrate dev` | Run database migrations |
| `yarn db:seed` | Seed the database with quotes |

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `yarn dev` | Start Vite development server |
| `yarn build` | Build for production |
| `yarn test` | Run component tests |

### Utility Scripts

| Script | Description |
|--------|-------------|
| `./scripts/setup.sh` | Initial project setup |
| `./scripts/dev.sh` | Start Docker Compose development environment |
| `./scripts/reset-db.sh` | Reset database and re-seed |

## API Documentation

See [docs/API.md](docs/API.md) for complete API documentation with request/response examples.

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Service layer testing with mocked database
- **Integration Tests**: API endpoint testing with Supertest
- **Component Tests**: React component testing with Testing Library
- **E2E Tests**: Full user flow testing with Playwright

Run all tests:
```bash
# Backend tests
cd backend && yarn test

# Frontend tests
cd frontend && yarn test

# E2E tests (requires running application)
yarn test:e2e
```

## License

This project is for educational and entertainment purposes.

---

*"I bent my wookie." - Ralph Wiggum*
