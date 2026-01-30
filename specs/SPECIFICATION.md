# Umpossible - Spezifikation

> "Me fail English? That's unpossible!" - Ralph Wiggum

## 1. Übersicht

**Umpossible** ist eine Webanwendung, die Zitate von Ralph Wiggum aus "Die Simpsons" anzeigt. Die Anwendung dient als kleiner, lustiger Zeitvertreib.

### 1.1 Ziele

- Unterhaltsame Darstellung von Ralph Wiggum Zitaten
- Einfache, schnelle Benutzererfahrung
- Community-Engagement durch Voting-System
- Barrierefreie und responsive Gestaltung

---

## 2. Funktionale Anforderungen

### 2.1 Hauptseite (Home)

| ID | Anforderung |
|----|-------------|
| F-HOME-01 | Beim Laden der Seite wird ein zufälliges Zitat angezeigt |
| F-HOME-02 | Button "Neues Zitat" lädt ein neues zufälliges Zitat |
| F-HOME-03 | Das aktuelle Zitat kann per Upvote bewertet werden |
| F-HOME-04 | Teilen-Button kopiert den Link zum aktuellen Zitat in die Zwischenablage |
| F-HOME-05 | Anzeige von Season und Episode zum aktuellen Zitat |
| F-HOME-06 | Anzeige der aktuellen Vote-Anzahl |

### 2.2 Zitatliste

| ID | Anforderung |
|----|-------------|
| F-LIST-01 | Auflistung aller Zitate mit Text, Season, Episode und Votes |
| F-LIST-02 | Sortierung nach Anzahl der Votes (aufsteigend/absteigend) |
| F-LIST-03 | Filterung nach Season |
| F-LIST-04 | Filterung nach Episode |
| F-LIST-05 | Kombination von Filtern möglich (Season + Episode) |
| F-LIST-06 | Upvote direkt aus der Liste möglich |

### 2.3 Voting-System

| ID | Anforderung |
|----|-------------|
| F-VOTE-01 | Nur Upvotes (keine Downvotes) |
| F-VOTE-02 | Jeder Besucher kann voten (keine Registrierung erforderlich) |
| F-VOTE-03 | Schutz vor Mehrfach-Voting durch Session-ID im Cookie |
| F-VOTE-04 | Ein Benutzer kann jedes Zitat maximal einmal upvoten |
| F-VOTE-05 | Visuelles Feedback, wenn bereits gevotet wurde |

### 2.4 Teilen-Funktion

| ID | Anforderung |
|----|-------------|
| F-SHARE-01 | Button "Link kopieren" kopiert URL zum Zitat |
| F-SHARE-02 | Direktlink zu einem spezifischen Zitat möglich (z.B. `/quote/123`) |
| F-SHARE-03 | Visuelles Feedback nach erfolgreichem Kopieren |

### 2.5 Admin-Bereich

| ID | Anforderung |
|----|-------------|
| F-ADMIN-01 | Zugang durch statisches Passwort geschützt |
| F-ADMIN-02 | Zitate erstellen (Text, Season, Episode) |
| F-ADMIN-03 | Zitate bearbeiten |
| F-ADMIN-04 | Zitate löschen |
| F-ADMIN-05 | Übersicht aller Zitate mit Votes |

---

## 3. Datenmodell

### 3.1 Quote (Zitat)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Eindeutige ID |
| text | String | Zitattext (Englisch) |
| season | Integer | Staffelnummer (1-35+) |
| episode | Integer | Episodennummer |
| votes | Integer | Anzahl der Upvotes (Default: 0) |
| created_at | Timestamp | Erstellungszeitpunkt |
| updated_at | Timestamp | Letzter Änderungszeitpunkt |

### 3.2 Vote (Abstimmung)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Eindeutige ID |
| quote_id | UUID | Referenz zum Zitat |
| session_id | String | Session-ID aus Cookie |
| created_at | Timestamp | Zeitpunkt des Votes |

**Constraint:** Unique auf (quote_id, session_id)

---

## 4. Nicht-Funktionale Anforderungen

### 4.1 Performance

| ID | Anforderung |
|----|-------------|
| NFA-PERF-01 | Initial JS Bundle < 150 KB (gzipped) |
| NFA-PERF-02 | Time to First Contentful Paint < 2s |
| NFA-PERF-03 | Effiziente Datenbankabfragen mit Indizes |

### 4.2 Sicherheit

| ID | Anforderung |
|----|-------------|
| NFA-SEC-01 | HTTPS Only (HTTP redirect auf HTTPS) |
| NFA-SEC-02 | Content Security Policy (CSP) Headers |
| NFA-SEC-03 | CORS konfiguriert (nur eigene Domain) |
| NFA-SEC-04 | SQL Injection Prevention (Prepared Statements) |
| NFA-SEC-05 | XSS Prevention (Input Sanitization, Output Encoding) |
| NFA-SEC-06 | Admin-Passwort sicher gespeichert (Environment Variable) |

### 4.3 Barrierefreiheit (Accessibility)

| ID | Anforderung |
|----|-------------|
| NFA-A11Y-01 | WCAG 2.1 Level AA Compliance |
| NFA-A11Y-02 | Keyboard Navigation: Alle Features ohne Maus bedienbar |
| NFA-A11Y-03 | Screen Reader Support: ARIA Labels für alle interaktiven Elemente |
| NFA-A11Y-04 | Color Contrast: Minimum 4.5:1 für normalen Text |
| NFA-A11Y-05 | Color Contrast: Minimum 3:1 für große Texte und UI-Komponenten |
| NFA-A11Y-06 | Focus-Indikatoren deutlich sichtbar |
| NFA-A11Y-07 | Skip-Links für Hauptnavigation |

### 4.4 SEO

| ID | Anforderung |
|----|-------------|
| NFA-SEO-01 | Semantisches HTML (h1, h2, main, nav, etc.) |
| NFA-SEO-02 | Meta-Tags (title, description, Open Graph) |
| NFA-SEO-03 | Strukturierte Daten (JSON-LD für Zitate) |
| NFA-SEO-04 | Canonical URLs |
| NFA-SEO-05 | Sitemap.xml |
| NFA-SEO-06 | robots.txt |

### 4.5 Datenschutz (DSGVO)

| ID | Anforderung |
|----|-------------|
| NFA-GDPR-01 | Cookie-Banner für Session-Cookie |
| NFA-GDPR-02 | Datenschutzerklärung (Privacy Policy) |
| NFA-GDPR-03 | Keine Tracking-Cookies ohne Einwilligung |
| NFA-GDPR-04 | Session-Cookie nur für Voting-Funktionalität |

### 4.6 Logging

| ID | Anforderung |
|----|-------------|
| NFA-LOG-01 | Structured Logging (JSON-Format) |
| NFA-LOG-02 | Log Levels: ERROR, WARN, INFO, DEBUG |
| NFA-LOG-03 | Request-Logging (Method, Path, Status, Duration) |
| NFA-LOG-04 | Error-Logging mit Stack Traces |
| NFA-LOG-05 | Keine sensiblen Daten in Logs |

---

## 5. Design

### 5.1 Theme

- **Stil:** Simpsons-inspiriert
- **Primärfarbe:** Simpsons-Gelb (#FFD90F)
- **Akzentfarben:** Himmelblau, Rosa (Ralph's Shirt)
- **Schriftart:** Verspielt aber lesbar (z.B. Comic-ähnlich für Headlines, Sans-Serif für Body)

### 5.2 Dark Mode

| ID | Anforderung |
|----|-------------|
| D-DARK-01 | Automatische Erkennung der System-Präferenz |
| D-DARK-02 | Manueller Toggle zum Umschalten |
| D-DARK-03 | Präferenz im Local Storage speichern |
| D-DARK-04 | Kontrastverhältnisse auch im Dark Mode einhalten |

### 5.3 Responsive Design

| Breakpoint | Breite | Beschreibung |
|------------|--------|--------------|
| Mobile | < 640px | Single Column, Touch-optimiert |
| Tablet | 640px - 1024px | Angepasstes Layout |
| Desktop | > 1024px | Volles Layout |

---

## 6. Technologie-Stack

### 6.1 Frontend

| Komponente | Technologie |
|------------|-------------|
| Framework | React 18+ |
| Build Tool | Vite |
| Styling | CSS Modules oder Tailwind CSS |
| HTTP Client | Fetch API |

### 6.2 Backend

| Komponente | Technologie |
|------------|-------------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Datenbank | PostgreSQL |
| ORM/Query Builder | Prisma oder Drizzle |

### 6.3 Testing

| Typ | Technologie |
|-----|-------------|
| Unit/Integration | Vitest |
| E2E | Playwright |
| Coverage | Vitest Coverage (c8/istanbul) |

### 6.4 Entwicklung

| Komponente | Technologie |
|------------|-------------|
| Sprache | TypeScript |
| Linting | ESLint |
| Formatting | Prettier |
| Package Manager | npm oder pnpm |

---

## 7. Seitenstruktur

```
/                     → Hauptseite (zufälliges Zitat)
/quote/:id            → Direktlink zu spezifischem Zitat
/quotes               → Zitatliste mit Filter/Sortierung
/admin                → Admin-Login
/admin/quotes         → Admin: Zitatverwaltung
/privacy              → Datenschutzerklärung
/imprint              → Impressum (falls erforderlich)
```

---

## 8. API-Endpunkte

### 8.1 Öffentliche API

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | /api/quotes/random | Zufälliges Zitat |
| GET | /api/quotes/:id | Einzelnes Zitat |
| GET | /api/quotes | Liste aller Zitate (mit Filter/Sort) |
| POST | /api/quotes/:id/vote | Upvote für Zitat |

#### Query-Parameter für GET /api/quotes

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| season | Integer | Filter nach Staffel |
| episode | Integer | Filter nach Episode |
| sort | String | Sortierung: "votes_asc", "votes_desc" |
| page | Integer | Seitennummer (Pagination) |
| limit | Integer | Einträge pro Seite (Default: 20) |

### 8.2 Admin API

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| POST | /api/admin/login | Admin-Login |
| GET | /api/admin/quotes | Alle Zitate (Admin-Ansicht) |
| POST | /api/admin/quotes | Zitat erstellen |
| PUT | /api/admin/quotes/:id | Zitat bearbeiten |
| DELETE | /api/admin/quotes/:id | Zitat löschen |

---

## 9. Lokale Entwicklung

Die Anwendung wird ausschließlich lokal mit Docker Compose betrieben.

| Komponente | Container |
|------------|-----------|
| Frontend + Backend | Node.js Container |
| PostgreSQL | PostgreSQL Container |

### 9.1 Start

```bash
docker-compose up
```

---

## 10. Initiale Daten

Während der Implementierung werden Ralph Wiggum Zitate recherchiert und als Seed-Daten bereitgestellt.

**Quellen:**
- Simpsons Wiki
- Transkripte der Episoden
- Kuratierte Listen

**Geschätzter Umfang:** 50-100 Zitate initial

---

## 11. Offene Punkte

| ID | Thema | Status |
|----|-------|--------|
| OP-01 | Exakte Farbpalette für Dark Mode | Im Design-Prozess |
| OP-02 | Impressum erforderlich? | Rechtliche Klärung |

---

## 12. Abnahmekriterien

Die Anwendung gilt als fertig, wenn:

- [ ] Alle funktionalen Anforderungen (F-*) umgesetzt sind
- [ ] Alle nicht-funktionalen Anforderungen (NFA-*) erfüllt sind
- [ ] E2E-Tests und Integrationstests vorhanden und grün
- [ ] Lighthouse Score > 90 für Performance, Accessibility, SEO
- [ ] Anwendung startet erfolgreich mit docker-compose
- [ ] Initiale Zitate eingepflegt
