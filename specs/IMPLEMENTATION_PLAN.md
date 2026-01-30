# Umpossible - Implementierungsplan

> Detaillierter Plan mit autonomen, kleinteiligen Tasks

## Entscheidungen

| Thema | Entscheidung |
|-------|--------------|
| Projektstruktur | Monorepo (/frontend, /backend, /shared) |
| Package Manager | Yarn 4 (Berry) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Admin Auth | Session-basiert mit PostgreSQL Store |
| Shared Types | Ja, in /shared Ordner |
| Docker | Dev-optimiert mit Hot-Reload |
| Linting | Strikt (ESLint + Prettier) |
| Initiale Daten | Seed-Datei |
| Admin-Passwort | Generieren und in `.env` speichern |
| Datenschutz | Deutschen DSGVO-konformen Text erstellen |
| Favicon | Emoji im Browser-Tab (🤪) |
| OG-Image | Weglassen |

---

## Phase 0: Voraussetzungen

### 0.1 Lokale Tools prüfen

- [ ] **T-0.1.1** Docker installiert prüfen (`docker --version`)
- [ ] **T-0.1.2** Docker Compose installiert prüfen (`docker compose version`)
- [ ] **T-0.1.3** Node.js 20+ installiert prüfen (`node --version`)
- [ ] **T-0.1.4** Corepack aktivieren (`corepack enable`)

---

## Phase 1: Projekt-Setup

### 1.1 Monorepo-Grundstruktur

- [ ] **T-1.1.1** Yarn 4 initialisieren (`yarn init -2`)
- [ ] **T-1.1.2** Workspaces konfigurieren in `package.json`:
  ```json
  {
    "workspaces": ["frontend", "backend", "shared"]
  }
  ```
- [ ] **T-1.1.3** `.yarnrc.yml` erstellen mit nodeLinker: node-modules
- [ ] **T-1.1.4** Ordnerstruktur anlegen: `/frontend`, `/backend`, `/shared`
- [ ] **T-1.1.5** `.gitignore` erstellen (node_modules, dist, .env, .yarn/cache)

### 1.2 TypeScript-Konfiguration

- [ ] **T-1.2.1** Root `tsconfig.json` als Base-Config erstellen
- [ ] **T-1.2.2** `/shared/tsconfig.json` erstellen (extends root)
- [ ] **T-1.2.3** `/backend/tsconfig.json` erstellen (extends root, Node-spezifisch)
- [ ] **T-1.2.4** `/frontend/tsconfig.json` erstellen (extends root, DOM-spezifisch)
- [ ] **T-1.2.5** Strikte TypeScript-Optionen aktivieren (strict, noUncheckedIndexedAccess, etc.)

### 1.3 ESLint + Prettier

- [ ] **T-1.3.1** ESLint 9 mit Flat Config installieren
- [ ] **T-1.3.2** `eslint.config.js` erstellen mit TypeScript-Parser
- [ ] **T-1.3.3** Prettier installieren und `.prettierrc` erstellen
- [ ] **T-1.3.4** ESLint-Prettier-Integration konfigurieren
- [ ] **T-1.3.5** `.prettierignore` erstellen
- [ ] **T-1.3.6** npm-Scripts hinzufügen: `lint`, `lint:fix`, `format`

### 1.4 Shared Package

- [ ] **T-1.4.1** `/shared/package.json` erstellen
- [ ] **T-1.4.2** `/shared/src/index.ts` als Entry Point
- [ ] **T-1.4.3** `/shared/src/types/quote.ts` - Quote Interface definieren
- [ ] **T-1.4.4** `/shared/src/types/vote.ts` - Vote Interface definieren
- [ ] **T-1.4.5** `/shared/src/types/api.ts` - API Request/Response Types
- [ ] **T-1.4.6** `/shared/src/constants.ts` - Gemeinsame Konstanten (Limits, etc.)

---

## Phase 2: Docker-Umgebung

### 2.1 Docker Compose

- [ ] **T-2.1.1** `docker-compose.yml` erstellen mit Services: postgres, backend, frontend
- [ ] **T-2.1.2** PostgreSQL Service konfigurieren (Port 5432, Volume für Daten)
- [ ] **T-2.1.3** Backend Service mit Volume Mounts für Hot-Reload
- [ ] **T-2.1.4** Frontend Service mit Volume Mounts für Hot-Reload
- [ ] **T-2.1.5** Netzwerk zwischen Services konfigurieren
- [ ] **T-2.1.6** `.env.example` erstellen mit allen Environment Variables
- [ ] **T-2.1.7** `.env` erstellen mit generiertem Admin-Passwort (sicheres 32-Zeichen-Passwort)

### 2.2 Dockerfiles

- [ ] **T-2.2.1** `/backend/Dockerfile.dev` erstellen (Node.js, nodemon)
- [ ] **T-2.2.2** `/frontend/Dockerfile.dev` erstellen (Node.js, Vite dev server)
- [ ] **T-2.2.3** `.dockerignore` erstellen

### 2.3 Initialisierungsskripte

- [ ] **T-2.3.1** `scripts/setup.sh` - Erstinstallation (yarn install, env kopieren)
- [ ] **T-2.3.2** `scripts/dev.sh` - Startet docker-compose mit Logs
- [ ] **T-2.3.3** `scripts/reset-db.sh` - Löscht DB und führt Migrations/Seed aus

---

## Phase 3: Backend-Grundgerüst

### 3.1 Express-Setup

- [ ] **T-3.1.1** `/backend/package.json` erstellen mit Dependencies
- [ ] **T-3.1.2** Express.js installieren mit TypeScript-Types
- [ ] **T-3.1.3** `/backend/src/index.ts` - Server Entry Point
- [ ] **T-3.1.4** `/backend/src/app.ts` - Express App konfigurieren
- [ ] **T-3.1.5** Middleware: JSON Body Parser
- [ ] **T-3.1.6** Middleware: CORS konfigurieren (localhost:5173)
- [ ] **T-3.1.7** Middleware: Cookie Parser
- [ ] **T-3.1.8** Health-Check Endpoint: `GET /api/health`

### 3.2 Prisma-Setup

- [ ] **T-3.2.1** Prisma CLI und Client installieren
- [ ] **T-3.2.2** `prisma init` ausführen
- [ ] **T-3.2.3** `/backend/prisma/schema.prisma` - Quote Model definieren
- [ ] **T-3.2.4** `/backend/prisma/schema.prisma` - Vote Model definieren
- [ ] **T-3.2.5** `/backend/prisma/schema.prisma` - Session Model für Admin-Auth
- [ ] **T-3.2.6** Unique Constraint für (quote_id, session_id) auf Vote
- [ ] **T-3.2.7** Indizes definieren (votes für Sortierung, season/episode für Filter)
- [ ] **T-3.2.8** `/backend/src/lib/prisma.ts` - Prisma Client Singleton

### 3.3 Datenbank-Migrations

- [ ] **T-3.3.1** Initiale Migration erstellen: `prisma migrate dev --name init`
- [ ] **T-3.3.2** `/backend/prisma/seed.ts` erstellen
- [ ] **T-3.3.3** Seed-Daten: 50 Ralph Wiggum Zitate recherchieren und einfügen
- [ ] **T-3.3.4** `prisma db seed` Befehl in package.json konfigurieren

### 3.4 Logging

- [ ] **T-3.4.1** Pino Logger installieren
- [ ] **T-3.4.2** `/backend/src/lib/logger.ts` - Logger konfigurieren (JSON-Format)
- [ ] **T-3.4.3** Request-Logging Middleware (pino-http)
- [ ] **T-3.4.4** Log-Levels über Environment Variable steuerbar

### 3.5 Error Handling

- [ ] **T-3.5.1** `/backend/src/lib/errors.ts` - Custom Error Klassen (AppError, NotFoundError, etc.)
- [ ] **T-3.5.2** `/backend/src/middleware/errorHandler.ts` - Globaler Error Handler
- [ ] **T-3.5.3** Async Wrapper für Route Handler (try/catch eliminieren)
- [ ] **T-3.5.4** 404 Handler für unbekannte Routen

---

## Phase 4: Backend API - Öffentlich

### 4.1 Quote-Routes

- [ ] **T-4.1.1** `/backend/src/routes/quotes.ts` - Router erstellen
- [ ] **T-4.1.2** `GET /api/quotes/random` - Zufälliges Zitat
- [ ] **T-4.1.3** `GET /api/quotes/:id` - Einzelnes Zitat by ID
- [ ] **T-4.1.4** `GET /api/quotes` - Liste mit Pagination (page, limit)
- [ ] **T-4.1.5** `GET /api/quotes` - Filter by season (Query Param)
- [ ] **T-4.1.6** `GET /api/quotes` - Filter by episode (Query Param)
- [ ] **T-4.1.7** `GET /api/quotes` - Sortierung by votes (asc/desc)
- [ ] **T-4.1.8** Input-Validierung mit Zod für alle Endpoints

### 4.2 Quote-Services

- [ ] **T-4.2.1** `/backend/src/services/quoteService.ts` erstellen
- [ ] **T-4.2.2** `getRandomQuote()` - Zufälliges Zitat aus DB
- [ ] **T-4.2.3** `getQuoteById(id)` - Einzelnes Zitat
- [ ] **T-4.2.4** `getQuotes(filters, pagination, sort)` - Gefilterte Liste
- [ ] **T-4.2.5** Unit Tests für QuoteService

### 4.3 Vote-Routes

- [ ] **T-4.3.1** `/backend/src/routes/votes.ts` - Router erstellen
- [ ] **T-4.3.2** `POST /api/quotes/:id/vote` - Upvote abgeben
- [ ] **T-4.3.3** Session-ID aus Cookie lesen oder neu generieren
- [ ] **T-4.3.4** Prüfen ob bereits gevotet (409 Conflict zurückgeben)
- [ ] **T-4.3.5** Vote-Count auf Quote erhöhen (Transaktion)

### 4.4 Vote-Services

- [ ] **T-4.4.1** `/backend/src/services/voteService.ts` erstellen
- [ ] **T-4.4.2** `createVote(quoteId, sessionId)` - Vote erstellen
- [ ] **T-4.4.3** `hasVoted(quoteId, sessionId)` - Prüfen ob bereits gevotet
- [ ] **T-4.4.4** `getVotedQuoteIds(sessionId)` - Alle gevoteten Quote-IDs
- [ ] **T-4.4.5** Unit Tests für VoteService

### 4.5 Session-Management (Visitor)

- [ ] **T-4.5.1** `/backend/src/middleware/sessionMiddleware.ts` erstellen
- [ ] **T-4.5.2** Session-ID Cookie setzen wenn nicht vorhanden (uuid)
- [ ] **T-4.5.3** Cookie-Optionen: httpOnly, sameSite, maxAge (1 Jahr)
- [ ] **T-4.5.4** Session-ID in Request-Objekt verfügbar machen

---

## Phase 5: Backend API - Admin

### 5.1 Admin-Authentifizierung

- [ ] **T-5.1.1** `/backend/src/routes/admin/auth.ts` - Auth Router
- [ ] **T-5.1.2** `POST /api/admin/login` - Login mit Passwort
- [ ] **T-5.1.3** Passwort gegen Environment Variable prüfen
- [ ] **T-5.1.4** express-session mit connect-pg-simple installieren
- [ ] **T-5.1.5** Session-Store Tabelle in Prisma Schema
- [ ] **T-5.1.6** Session nach erfolgreichem Login erstellen
- [ ] **T-5.1.7** `POST /api/admin/logout` - Session zerstören
- [ ] **T-5.1.8** `GET /api/admin/me` - Aktuellen Auth-Status prüfen

### 5.2 Admin-Middleware

- [ ] **T-5.2.1** `/backend/src/middleware/adminAuth.ts` erstellen
- [ ] **T-5.2.2** Session auf isAdmin Flag prüfen
- [ ] **T-5.2.3** 401 Unauthorized bei fehlendem/ungültigem Session

### 5.3 Admin Quote-Management

- [ ] **T-5.3.1** `/backend/src/routes/admin/quotes.ts` - Admin Quote Router
- [ ] **T-5.3.2** `GET /api/admin/quotes` - Alle Zitate (mit Votes)
- [ ] **T-5.3.3** `POST /api/admin/quotes` - Neues Zitat erstellen
- [ ] **T-5.3.4** `PUT /api/admin/quotes/:id` - Zitat bearbeiten
- [ ] **T-5.3.5** `DELETE /api/admin/quotes/:id` - Zitat löschen (cascade Votes)
- [ ] **T-5.3.6** Input-Validierung mit Zod für alle Admin-Endpoints

### 5.4 Admin-Services

- [ ] **T-5.4.1** `/backend/src/services/adminQuoteService.ts` erstellen
- [ ] **T-5.4.2** `createQuote(data)` - Neues Zitat
- [ ] **T-5.4.3** `updateQuote(id, data)` - Zitat aktualisieren
- [ ] **T-5.4.4** `deleteQuote(id)` - Zitat und zugehörige Votes löschen
- [ ] **T-5.4.5** Unit Tests für AdminQuoteService

---

## Phase 6: Frontend-Grundgerüst

### 6.1 Vite + React Setup

- [ ] **T-6.1.1** `/frontend/package.json` erstellen
- [ ] **T-6.1.2** Vite mit React-TS Template initialisieren
- [ ] **T-6.1.3** Tailwind CSS installieren und konfigurieren
- [ ] **T-6.1.4** `/frontend/tailwind.config.js` - Simpsons-Farbpalette
- [ ] **T-6.1.5** `/frontend/src/index.css` - Tailwind Directives + Base Styles
- [ ] **T-6.1.6** Vite Proxy für `/api` auf Backend konfigurieren

### 6.2 Projektstruktur Frontend

- [ ] **T-6.2.1** `/frontend/src/components/` - Ordner anlegen
- [ ] **T-6.2.2** `/frontend/src/pages/` - Ordner anlegen
- [ ] **T-6.2.3** `/frontend/src/hooks/` - Ordner anlegen
- [ ] **T-6.2.4** `/frontend/src/lib/` - Ordner anlegen
- [ ] **T-6.2.5** `/frontend/src/types/` - Re-Export von shared Types

### 6.3 API Client

- [ ] **T-6.3.1** `/frontend/src/lib/api.ts` - Fetch Wrapper erstellen
- [ ] **T-6.3.2** Base URL Konfiguration (Vite env)
- [ ] **T-6.3.3** Error Handling (throw bei non-2xx)
- [ ] **T-6.3.4** `api.quotes.getRandom()` - Zufälliges Zitat
- [ ] **T-6.3.5** `api.quotes.getById(id)` - Einzelnes Zitat
- [ ] **T-6.3.6** `api.quotes.getList(params)` - Zitatliste
- [ ] **T-6.3.7** `api.quotes.vote(id)` - Upvote
- [ ] **T-6.3.8** `api.admin.*` - Admin API Funktionen

### 6.4 Routing

- [ ] **T-6.4.1** React Router installieren
- [ ] **T-6.4.2** `/frontend/src/App.tsx` - Router Setup
- [ ] **T-6.4.3** Route: `/` - Home
- [ ] **T-6.4.4** Route: `/quote/:id` - Einzelnes Zitat
- [ ] **T-6.4.5** Route: `/quotes` - Zitatliste
- [ ] **T-6.4.6** Route: `/admin` - Admin Login
- [ ] **T-6.4.7** Route: `/admin/quotes` - Admin Quotes
- [ ] **T-6.4.8** Route: `/privacy` - Datenschutz
- [ ] **T-6.4.9** 404 Route für unbekannte Pfade

---

## Phase 7: Frontend - Hauptseite

### 7.1 Layout-Komponenten

- [ ] **T-7.1.1** `/frontend/src/components/Layout.tsx` - Hauptlayout
- [ ] **T-7.1.2** `/frontend/src/components/Header.tsx` - Navigation
- [ ] **T-7.1.3** `/frontend/src/components/Footer.tsx` - Footer mit Links
- [ ] **T-7.1.4** `/frontend/src/components/SkipLink.tsx` - Skip to Content
- [ ] **T-7.1.5** Responsive Navigation (Mobile Hamburger Menu)

### 7.2 Theme & Dark Mode

- [ ] **T-7.2.1** `/frontend/src/hooks/useTheme.ts` - Theme Hook
- [ ] **T-7.2.2** System-Präferenz erkennen (prefers-color-scheme)
- [ ] **T-7.2.3** LocalStorage für manuelle Präferenz
- [ ] **T-7.2.4** `/frontend/src/components/ThemeToggle.tsx` - Toggle Button
- [ ] **T-7.2.5** CSS Variablen für Light/Dark Theme in tailwind.config.js

### 7.3 Home Page

- [ ] **T-7.3.1** `/frontend/src/pages/Home.tsx` - Seitenkomponente
- [ ] **T-7.3.2** `/frontend/src/components/QuoteCard.tsx` - Zitat-Anzeige
- [ ] **T-7.3.3** Zufälliges Zitat beim Laden fetchen
- [ ] **T-7.3.4** "Neues Zitat" Button mit Animation
- [ ] **T-7.3.5** Season/Episode Anzeige
- [ ] **T-7.3.6** Vote-Count Anzeige
- [ ] **T-7.3.7** Loading State während Fetch

### 7.4 Voting UI

- [ ] **T-7.4.1** `/frontend/src/components/VoteButton.tsx` - Upvote Button
- [ ] **T-7.4.2** Optimistic UI Update bei Vote
- [ ] **T-7.4.3** Visuelles Feedback wenn bereits gevotet
- [ ] **T-7.4.4** Error Handling bei Vote-Fehler
- [ ] **T-7.4.5** `/frontend/src/hooks/useVotedQuotes.ts` - Lokaler State für gevotete Quotes

### 7.5 Teilen-Funktion

- [ ] **T-7.5.1** `/frontend/src/components/ShareButton.tsx` - Teilen Button
- [ ] **T-7.5.2** Clipboard API für "Link kopieren"
- [ ] **T-7.5.3** Toast/Notification bei erfolgreichem Kopieren
- [ ] **T-7.5.4** `/frontend/src/components/Toast.tsx` - Toast Komponente

---

## Phase 8: Frontend - Zitatliste

### 8.1 Liste-Seite

- [ ] **T-8.1.1** `/frontend/src/pages/Quotes.tsx` - Seitenkomponente
- [ ] **T-8.1.2** `/frontend/src/components/QuoteListItem.tsx` - Listen-Item
- [ ] **T-8.1.3** Zitate laden mit Pagination
- [ ] **T-8.1.4** Infinite Scroll oder "Mehr laden" Button

### 8.2 Filter & Sortierung

- [ ] **T-8.2.1** `/frontend/src/components/QuoteFilters.tsx` - Filter UI
- [ ] **T-8.2.2** Season Dropdown Filter
- [ ] **T-8.2.3** Episode Dropdown Filter (abhängig von Season)
- [ ] **T-8.2.4** Sortierung Toggle (Votes aufsteigend/absteigend)
- [ ] **T-8.2.5** URL Query Params für Filter/Sort State
- [ ] **T-8.2.6** Filter zurücksetzen Button

### 8.3 Interaktionen

- [ ] **T-8.3.1** Vote direkt aus Liste möglich
- [ ] **T-8.3.2** Klick auf Zitat öffnet Detailansicht
- [ ] **T-8.3.3** Loading States für Filter-Änderungen

---

## Phase 9: Frontend - Admin

### 9.1 Admin Login

- [ ] **T-9.1.1** `/frontend/src/pages/AdminLogin.tsx` - Login Seite
- [ ] **T-9.1.2** Passwort-Input mit Show/Hide Toggle
- [ ] **T-9.1.3** Login Form Submit
- [ ] **T-9.1.4** Error-Anzeige bei falschem Passwort
- [ ] **T-9.1.5** Redirect zu /admin/quotes nach Login

### 9.2 Admin Auth State

- [ ] **T-9.2.1** `/frontend/src/hooks/useAdminAuth.ts` - Auth Hook
- [ ] **T-9.2.2** Auth-Status beim App-Start prüfen
- [ ] **T-9.2.3** `/frontend/src/components/AdminRoute.tsx` - Protected Route
- [ ] **T-9.2.4** Redirect zu Login wenn nicht authentifiziert
- [ ] **T-9.2.5** Logout Funktion

### 9.3 Admin Quote-Verwaltung

- [ ] **T-9.3.1** `/frontend/src/pages/AdminQuotes.tsx` - Übersicht
- [ ] **T-9.3.2** Tabelle mit allen Zitaten
- [ ] **T-9.3.3** Sortierung nach Votes, Created, etc.
- [ ] **T-9.3.4** "Neues Zitat" Button
- [ ] **T-9.3.5** Edit/Delete Buttons pro Zeile

### 9.4 Quote CRUD UI

- [ ] **T-9.4.1** `/frontend/src/components/QuoteForm.tsx` - Formular
- [ ] **T-9.4.2** Felder: Text (Textarea), Season (Number), Episode (Number)
- [ ] **T-9.4.3** Client-Side Validierung
- [ ] **T-9.4.4** `/frontend/src/components/QuoteModal.tsx` - Modal für Create/Edit
- [ ] **T-9.4.5** Bestätigungsdialog für Löschen
- [ ] **T-9.4.6** Success/Error Feedback nach Aktionen

---

## Phase 10: Accessibility

### 10.1 Keyboard Navigation

- [ ] **T-10.1.1** Alle interaktiven Elemente per Tab erreichbar
- [ ] **T-10.1.2** Focus-Reihenfolge logisch
- [ ] **T-10.1.3** Sichtbare Focus-Indikatoren (Tailwind ring)
- [ ] **T-10.1.4** Escape schließt Modals
- [ ] **T-10.1.5** Enter/Space aktiviert Buttons

### 10.2 Screen Reader

- [ ] **T-10.2.1** ARIA Labels für alle Buttons ohne Text
- [ ] **T-10.2.2** ARIA Live Regions für dynamische Updates
- [ ] **T-10.2.3** Semantische Überschriften (h1, h2, h3)
- [ ] **T-10.2.4** Alt-Texte für alle Bilder (falls vorhanden)
- [ ] **T-10.2.5** ARIA Roles für Navigation, Main, etc.

### 10.3 Weitere A11y

- [ ] **T-10.3.1** Farbkontrast prüfen (axe-core)
- [ ] **T-10.3.2** Text-Zoom bis 200% ohne Probleme
- [ ] **T-10.3.3** Reduzierte Bewegung respektieren (prefers-reduced-motion)
- [ ] **T-10.3.4** Touch-Targets mindestens 44x44px

---

## Phase 11: SEO & Meta

### 11.1 Meta Tags

- [ ] **T-11.1.1** `/frontend/src/components/SEO.tsx` - Helmet Komponente
- [ ] **T-11.1.2** Title Tag pro Seite dynamisch
- [ ] **T-11.1.3** Meta Description pro Seite
- [ ] **T-11.1.4** Open Graph Tags (og:title, og:description, og:image)
- [ ] **T-11.1.5** Twitter Card Meta Tags
- [ ] **T-11.1.6** Canonical URLs

### 11.2 Strukturierte Daten

- [ ] **T-11.2.1** JSON-LD für Zitate (Quotation Schema)
- [ ] **T-11.2.2** JSON-LD in QuoteCard integrieren

### 11.3 Statische Dateien

- [ ] **T-11.3.1** `/frontend/public/robots.txt` erstellen
- [ ] **T-11.3.2** Sitemap.xml generieren (oder manuell)
- [ ] **T-11.3.3** Emoji-Favicon: 🤪 als SVG-Favicon in `/frontend/index.html` einbinden
- [ ] ~~**T-11.3.4** OG Image erstellen~~ *(entfällt - kein OG-Image)*

---

## Phase 12: Datenschutz

### 12.1 Cookie-Banner

- [ ] **T-12.1.1** `/frontend/src/components/CookieBanner.tsx` erstellen
- [ ] **T-12.1.2** Consent-Status in LocalStorage speichern
- [ ] **T-12.1.3** Voting nur mit Cookie-Consent aktivieren
- [ ] **T-12.1.4** Banner schließen nach Zustimmung

### 12.2 Rechtliche Seiten

- [ ] **T-12.2.1** `/frontend/src/pages/Privacy.tsx` - Datenschutzerklärung
- [ ] **T-12.2.2** DSGVO-konformen deutschen Datenschutztext erstellen:
  - Verantwortlicher (Platzhalter für Kontaktdaten)
  - Session-Cookie Erklärung (Zweck: Voting, Speicherdauer: 1 Jahr)
  - Keine Weitergabe an Dritte
  - Rechte der Betroffenen (Auskunft, Löschung, etc.)
  - Keine Tracking-Cookies, keine Analytics

---

## Phase 13: Sicherheit

### 13.1 Backend Security

- [ ] **T-13.1.1** Helmet.js für Security Headers installieren
- [ ] **T-13.1.2** Content-Security-Policy konfigurieren
- [ ] **T-13.1.3** Rate Limiting für API Endpoints (express-rate-limit)
- [ ] **T-13.1.4** Rate Limiting für Vote Endpoint (strenger)
- [ ] **T-13.1.5** Input Sanitization Review

### 13.2 CORS & Cookies

- [ ] **T-13.2.1** CORS Origin auf Frontend-URL beschränken
- [ ] **T-13.2.2** Cookie Secure Flag in Production
- [ ] **T-13.2.3** SameSite Cookie Attribut

---

## Phase 14: Testing

### 14.1 Backend Unit Tests

- [ ] **T-14.1.1** Vitest für Backend konfigurieren
- [ ] **T-14.1.2** Tests für QuoteService
- [ ] **T-14.1.3** Tests für VoteService
- [ ] **T-14.1.4** Tests für AdminQuoteService
- [ ] **T-14.1.5** Tests für Middleware (Session, Auth)

### 14.2 Backend Integration Tests

- [ ] **T-14.2.1** Supertest installieren
- [ ] **T-14.2.2** Test-Datenbank Setup (Docker)
- [ ] **T-14.2.3** Tests für Quote-Endpoints
- [ ] **T-14.2.4** Tests für Vote-Endpoints
- [ ] **T-14.2.5** Tests für Admin-Endpoints

### 14.3 Frontend Tests

- [ ] **T-14.3.1** Vitest + React Testing Library konfigurieren
- [ ] **T-14.3.2** Tests für QuoteCard Komponente
- [ ] **T-14.3.3** Tests für VoteButton Komponente
- [ ] **T-14.3.4** Tests für QuoteFilters Komponente
- [ ] **T-14.3.5** Tests für useTheme Hook

### 14.4 E2E Tests

- [ ] **T-14.4.1** Playwright installieren und konfigurieren
- [ ] **T-14.4.2** E2E: Home Seite laden und Zitat anzeigen
- [ ] **T-14.4.3** E2E: Neues Zitat laden
- [ ] **T-14.4.4** E2E: Upvote abgeben
- [ ] **T-14.4.5** E2E: Zitatliste filtern und sortieren
- [ ] **T-14.4.6** E2E: Admin Login und Zitat erstellen
- [ ] **T-14.4.7** E2E: Dark Mode Toggle
- [ ] **T-14.4.8** E2E: Accessibility Tests (axe-core)

---

## Phase 15: Performance & Polishing

### 15.1 Performance

- [ ] **T-15.1.1** Bundle-Size analysieren (vite-plugin-visualizer)
- [ ] **T-15.1.2** Code-Splitting für Admin-Routes
- [ ] **T-15.1.3** Lazy Loading für Bilder (falls vorhanden)
- [ ] **T-15.1.4** Lighthouse Audit durchführen
- [ ] **T-15.1.5** Performance-Issues beheben bis Score > 90

### 15.2 Final Polish

- [ ] **T-15.2.1** Loading Skeletons für bessere UX
- [ ] **T-15.2.2** Error Boundaries für Fehlerbehandlung
- [ ] **T-15.2.3** 404 Seite gestalten
- [ ] **T-15.2.4** Animationen und Transitions feintunen
- [ ] **T-15.2.5** Cross-Browser Testing (Chrome, Firefox, Safari)
- [ ] **T-15.2.6** Mobile Testing auf echten Geräten

---

## Phase 16: Dokumentation & Abschluss

### 16.1 Projekt-Dokumentation

- [ ] **T-16.1.1** `README.md` - Projektübersicht, Features, Screenshots
- [ ] **T-16.1.2** `README.md` - Setup-Anleitung (Prerequisites, Installation, Start)
- [ ] **T-16.1.3** `README.md` - Verfügbare Scripts (dev, test, lint, etc.)
- [ ] **T-16.1.4** `docs/ARCHITECTURE.md` - Ordnerstruktur mit Beschreibungen
- [ ] **T-16.1.5** `docs/ARCHITECTURE.md` - Komponenten-Übersicht (Frontend)
- [ ] **T-16.1.6** `docs/ARCHITECTURE.md` - Service-Übersicht (Backend)
- [ ] **T-16.1.7** `docs/API.md` - Alle Endpoints mit Request/Response Beispielen
- [ ] **T-16.1.8** `.env.example` - Alle Variablen mit Beschreibung kommentiert

### 16.2 Code-Dokumentation

- [ ] **T-16.2.1** JSDoc für alle Service-Funktionen (Backend)
- [ ] **T-16.2.2** JSDoc für alle Custom Hooks (Frontend)
- [ ] **T-16.2.3** JSDoc für alle Utility-Funktionen
- [ ] **T-16.2.4** TypeScript-Interfaces mit `/** */` Kommentaren
- [ ] **T-16.2.5** Inline-Kommentare für komplexe Algorithmen/Logik
- [ ] **T-16.2.6** README.md in `/shared` - Beschreibung der shared Types

### 16.3 Abnahme

- [ ] **T-16.3.1** Alle funktionalen Anforderungen (F-*) prüfen
- [ ] **T-16.3.2** Alle nicht-funktionalen Anforderungen (NFA-*) prüfen
- [ ] **T-16.3.3** Lighthouse Score > 90 verifizieren
- [ ] **T-16.3.4** docker-compose up startet erfolgreich
- [ ] **T-16.3.5** Seed-Daten sind geladen

---

*Plan erstellt: Januar 2026*
*Geschätzte Tasks: ~200*
