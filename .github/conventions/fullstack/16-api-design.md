# Convention 16 — API Design

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** REST API Design, Endpoints, Request/Response Conventions für AIVA Health.  
> **Geladen von:** Developer Agent, Reviewer Agent

---

## REST API Conventions

### URL-Struktur

```
Base URL: /api/v1

# Resources (Plural, kebab-case)
GET    /api/v1/appointments              # Liste
GET    /api/v1/appointments/:id          # Detail
POST   /api/v1/appointments              # Erstellen
PUT    /api/v1/appointments/:id          # Update (komplett)
PATCH  /api/v1/appointments/:id          # Update (teilweise)
DELETE /api/v1/appointments/:id          # Löschen

# Nested Resources
GET    /api/v1/patients/:id/appointments
GET    /api/v1/patients/:id/medications
GET    /api/v1/patients/:id/lab-results
GET    /api/v1/patients/:id/check-ins
GET    /api/v1/patients/:id/vital-signs

# Actions (Verb als Suffix wenn nötig)
POST   /api/v1/appointments/:id/cancel
POST   /api/v1/appointments/:id/reschedule
POST   /api/v1/medications/:id/take       # Medikament genommen
POST   /api/v1/medications/:id/skip       # Medikament übersprungen
```

### Verbotene Patterns

- ❌ Verben in URLs: `/api/getAppointments`
- ❌ Singular: `/api/appointment`
- ❌ camelCase: `/api/labResults`
- ❌ Deutsche Begriffe: `/api/termine`

---

## Request/Response Format

### Standard Response Envelope

```typescript
// Erfolg — Einzelnes Objekt
{
  "data": {
    "id": "appt-123",
    "patientId": "patient-456",
    "date": "2026-03-15T10:00:00Z",
    "provider": "Dr. Schmidt",
    "status": "BOOKED"
  }
}

// Erfolg — Liste mit Pagination
{
  "data": [
    { "id": "appt-123", ... },
    { "id": "appt-456", ... }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 42,
    "totalPages": 3
  }
}

// Fehler
{
  "error": {
    "code": "CONSENT_REQUIRED",
    "message": "Consent required for scope 'labs:read'",
    "timestamp": "2026-02-03T10:30:00Z",
    "requestId": "req-abc123"
  }
}
```

### HTTP Status Codes

| Code | Verwendung | AIVA Beispiel |
|------|-----------|---------------|
| `200` | Erfolg | GET /appointments |
| `201` | Erstellt | POST /appointments |
| `204` | Kein Content | DELETE /appointments/:id |
| `400` | Validation Error | Ungültige Herzfrequenz |
| `401` | Nicht authentifiziert | Kein/abgelaufenes JWT |
| `403` | Kein Consent/Permission | ConsentRequiredError |
| `404` | Nicht gefunden | Termin existiert nicht |
| `422` | Business Logic Error | Termin in Vergangenheit |
| `429` | Rate Limit | Zu viele Requests |
| `500` | Server Error | Unerwarteter Fehler |

---

## Pagination

```typescript
// Query Parameters
GET /api/v1/appointments?page=1&pageSize=20&sortBy=date&sortOrder=desc

// Interface
interface PaginationParams {
  page: number;        // Default: 1
  pageSize: number;    // Default: 20, Max: 100
  sortBy?: string;     // Default: 'createdAt'
  sortOrder?: 'asc' | 'desc';  // Default: 'desc'
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

---

## Filtering

```typescript
// Query Parameter Patterns
GET /api/v1/appointments?status=BOOKED&from=2026-03-01&to=2026-03-31
GET /api/v1/medications?frequency=twice_daily&isActive=true
GET /api/v1/vital-signs?type=heart_rate&from=2026-02-01&to=2026-02-28
GET /api/v1/lab-results?status=abnormal
```

---

## API Versioning

```
/api/v1/appointments   ← Aktuelle Version
/api/v2/appointments   ← Zukünftige Breaking Changes
```

- **URL-basiert**: `/api/v1/...` (einfach, klar)
- **Breaking Changes**: Neue Major Version
- **Backward Compatible**: Felder hinzufügen ist ok

---

## AIVA Health API Übersicht

### Core

| Endpoint | Method | Beschreibung |
|----------|--------|-------------|
| `/api/v1/auth/login` | POST | Anmelden |
| `/api/v1/auth/register` | POST | Registrieren |
| `/api/v1/auth/refresh` | POST | Token erneuern |
| `/api/v1/patients/me` | GET | Eigenes Profil |
| `/api/v1/patients/me` | PATCH | Profil aktualisieren |
| `/api/v1/consents` | GET | Aktive Einwilligungen |
| `/api/v1/consents` | POST | Einwilligung erteilen |
| `/api/v1/consents/:id/revoke` | POST | Einwilligung widerrufen |

### AIVA Care

| Endpoint | Method | Beschreibung |
|----------|--------|-------------|
| `/api/v1/appointments` | GET | Termine Liste |
| `/api/v1/appointments` | POST | Termin buchen |
| `/api/v1/appointments/:id` | GET | Termin Detail |
| `/api/v1/appointments/:id/cancel` | POST | Termin absagen |
| `/api/v1/preventive-care` | GET | Vorsorge-Kalender |

### AIVA Labs

| Endpoint | Method | Beschreibung |
|----------|--------|-------------|
| `/api/v1/medications` | GET | Medikamenten-Liste |
| `/api/v1/medications` | POST | Medikament hinzufügen |
| `/api/v1/medications/:id/take` | POST | Genommen |
| `/api/v1/medications/:id/skip` | POST | Übersprungen |
| `/api/v1/lab-results` | GET | Laborbefunde |
| `/api/v1/lab-results/:id` | GET | Einzelner Befund |

### AIVA Coach

| Endpoint | Method | Beschreibung |
|----------|--------|-------------|
| `/api/v1/check-ins` | POST | Täglicher Check-In |
| `/api/v1/check-ins` | GET | Check-In Historie |
| `/api/v1/vital-signs` | GET | Vitalzeichen |
| `/api/v1/recommendations` | GET | Empfehlungen |

### AIVA Family

| Endpoint | Method | Beschreibung |
|----------|--------|-------------|
| `/api/v1/family-accounts` | GET | Familienkonto |
| `/api/v1/family-accounts` | POST | Konto erstellen |
| `/api/v1/family-members` | GET | Mitglieder |
| `/api/v1/family-invites` | POST | Einladung senden |

---

## Cross-References

- **Backend Patterns** → [Convention 15: Backend](15-backend.md)
- **Naming** → [Convention 02: Naming](../code-architecture/02-naming.md)
- **Security** → [Convention 05: Security](../process-quality/05-security.md)
- **Modules** → [Context: Modules](../../context/modules.md)
