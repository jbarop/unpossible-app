# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### Visitor Sessions

All visitors automatically receive a session cookie (`session_id`) for tracking votes. No authentication required for public endpoints.

### Admin Authentication

Admin endpoints require an authenticated session. Login with the admin password configured in `ADMIN_PASSWORD` environment variable.

---

## Public Endpoints

### Health Check

Check if the API is running.

```
GET /api/health
```

**Response**
```json
{
  "status": "ok"
}
```

---

### Get Random Quote

Retrieve a random Ralph Wiggum quote.

```
GET /api/quotes/random
```

**Response**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Me fail English? That's unpossible!",
    "season": 6,
    "episode": 8,
    "votes": 42,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-20T15:45:00.000Z",
    "hasVoted": false
  }
}
```

---

### Get Quote by ID

Retrieve a specific quote.

```
GET /api/quotes/:id
```

**Parameters**
| Name | Type | Description |
|------|------|-------------|
| id | UUID | Quote identifier |

**Response**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "I bent my wookie.",
    "season": 5,
    "episode": 10,
    "votes": 28,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-20T15:45:00.000Z",
    "hasVoted": true
  }
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 404 | Quote not found |

---

### List Quotes

Retrieve a paginated list of quotes with optional filtering and sorting.

```
GET /api/quotes
```

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| page | integer | 1 | Page number (1-based) |
| limit | integer | 20 | Items per page |
| season | integer | - | Filter by season |
| episode | integer | - | Filter by episode |
| sort | string | - | Sort order: `votes_asc` or `votes_desc` |

**Example**
```
GET /api/quotes?season=5&sort=votes_desc&page=1&limit=10
```

**Response**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "text": "I bent my wookie.",
      "season": 5,
      "episode": 10,
      "votes": 28,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-20T15:45:00.000Z",
      "hasVoted": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### Vote for Quote

Upvote a quote. Each visitor can only vote once per quote.

```
POST /api/quotes/:id/vote
```

**Parameters**
| Name | Type | Description |
|------|------|-------------|
| id | UUID | Quote identifier |

**Response**
```json
{
  "data": {
    "success": true,
    "votes": 43
  }
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 404 | Quote not found |
| 409 | Already voted for this quote |
| 429 | Rate limit exceeded |

---

## Admin Endpoints

All admin endpoints require authentication via session cookie.

### Login

Authenticate as admin.

```
POST /api/admin/login
```

**Request Body**
```json
{
  "password": "your-admin-password"
}
```

**Response**
```json
{
  "success": true,
  "message": "Logged in successfully"
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 401 | Invalid password |

---

### Logout

End admin session.

```
POST /api/admin/logout
```

**Response**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Check Auth Status

Verify current authentication status.

```
GET /api/admin/me
```

**Response (authenticated)**
```json
{
  "authenticated": true
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 401 | Not authenticated |

---

### List All Quotes (Admin)

Retrieve all quotes with admin view.

```
GET /api/admin/quotes
```

**Query Parameters**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |

**Response**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "text": "I bent my wookie.",
      "season": 5,
      "episode": 10,
      "votes": 28,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-20T15:45:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### Create Quote

Add a new quote.

```
POST /api/admin/quotes
```

**Request Body**
```json
{
  "text": "My cat's breath smells like cat food.",
  "season": 4,
  "episode": 15
}
```

**Validation**
| Field | Rules |
|-------|-------|
| text | Required, 1-1000 characters |
| season | Required, positive integer |
| episode | Required, positive integer |

**Response** (201 Created)
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "text": "My cat's breath smells like cat food.",
    "season": 4,
    "episode": 15,
    "votes": 0,
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Not authenticated |

---

### Update Quote

Edit an existing quote.

```
PUT /api/admin/quotes/:id
```

**Parameters**
| Name | Type | Description |
|------|------|-------------|
| id | UUID | Quote identifier |

**Request Body** (all fields optional)
```json
{
  "text": "Updated quote text",
  "season": 5,
  "episode": 12
}
```

**Response**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Updated quote text",
    "season": 5,
    "episode": 12,
    "votes": 28,
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-25T12:00:00.000Z"
  }
}
```

**Errors**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Not authenticated |
| 404 | Quote not found |

---

### Delete Quote

Remove a quote and all associated votes.

```
DELETE /api/admin/quotes/:id
```

**Parameters**
| Name | Type | Description |
|------|------|-------------|
| id | UUID | Quote identifier |

**Response**

Status: 204 No Content

**Errors**
| Status | Description |
|--------|-------------|
| 401 | Not authenticated |
| 404 | Quote not found |

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| NOT_FOUND | 404 | Resource not found |
| BAD_REQUEST | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Authentication required |
| CONFLICT | 409 | Resource conflict (e.g., already voted) |
| TOO_MANY_REQUESTS | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests per 15 minutes |
| Vote endpoint | 10 requests per minute |

When rate limited, the response includes:
- Status: 429 Too Many Requests
- Header: `Retry-After` with seconds until reset
