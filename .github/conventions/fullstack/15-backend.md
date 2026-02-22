# Convention 15 — Backend

> **Version:** v1.0.0  
> **Stand:** 2026-02-03  
> **Purpose:** Backend Architecture, API Layer, Database, Service Patterns für AIVA Health.  
> **Geladen von:** Developer Agent, Reviewer Agent

---

## Service Layer Architecture

```
┌─────────────────────────────────┐
│         API Controllers          │  ← HTTP/REST Layer
│  (Validation, Auth, Routing)     │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────────┐
│       Application Services       │  ← Orchestration
│  (Use Cases, Consent Checks)     │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────────┐
│        Domain Services           │  ← Business Logic
│  (Validation, Calculations)      │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────────┐
│       Repositories (Ports)       │  ← Data Access (Interface)
│  (IAppointmentRepo, ILabRepo)    │
└──────────┬──────────────────────┘
           │
┌──────────▼──────────────────────┐
│       Adapters (Infrastructure)  │  ← Concrete Implementations
│  (InMemory / Postgres / API)     │
└─────────────────────────────────┘
```

---

## Controller Pattern

```typescript
// ✅ Thin Controller — nur Routing, Validation, Response
class AppointmentController {
  constructor(private bookingService: AppointmentBookingService) {}

  async create(req: Request, res: Response): Promise<void> {
    // 1. Input Validation
    const body = BookingRequestSchema.parse(req.body);
    
    // 2. Delegate to Service
    const appointment = await this.bookingService.book(
      req.user.patientId,
      body
    );
    
    // 3. Response
    res.status(201).json(appointment);
  }

  async getByPatient(req: Request, res: Response): Promise<void> {
    const appointments = await this.bookingService.getForPatient(
      req.user.patientId
    );
    res.json(appointments);
  }
}
```

### Controller Rules

- **Thin**: Keine Business Logic im Controller
- **Validation**: Zod Schema am Eingang
- **Auth**: Middleware prüft Token vor Controller
- **Error Handling**: Global Error Handler fängt alles

---

## Dependency Injection

```typescript
// Composition Root — Alle Dependencies werden hier zusammengebaut
function createAppContext(): AppContext {
  // Repositories (Adapters)
  const appointmentRepo = process.env.USE_MOCK === 'true'
    ? new InMemoryAppointmentRepository()
    : new PostgresAppointmentRepository(dbConnection);

  const wearableProvider = process.env.USE_MOCK === 'true'
    ? new MockWearableProvider()
    : new AppleHealthProvider();

  // Services
  const consentService = new ConsentService(new InMemoryConsentRepository());
  const auditService = new AuditService(new InMemoryAuditRepository());
  const bookingService = new AppointmentBookingService(
    appointmentRepo,
    consentService,
    auditService
  );

  return { bookingService, consentService, auditService };
}
```

---

## Database Patterns

### MVP: In-Memory Repository

```typescript
class InMemoryRepository<T extends { id: string }> {
  protected store = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<T[]> {
    return [...this.store.values()];
  }

  async save(entity: T): Promise<void> {
    this.store.set(entity.id, { ...entity });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
```

### Post-MVP: Database Rules

| Regel | Detail |
|-------|--------|
| **ORM** | Eigenständig entscheiden (Prisma, Drizzle, TypeORM) |
| **Migrations** | Versioniert, reversibel |
| **Connection Pooling** | Max 20 connections (configurable) |
| **Encryption** | Health Data Columns verschlüsselt |
| **Soft Delete** | Für Audit-Trail: `deletedAt` statt tatsächliche Löschung |
| **Indexes** | Auf `patientId`, `status`, `date` Felder |

---

## Middleware Stack

```typescript
// Middleware-Reihenfolge (von außen nach innen)
app.use(requestIdMiddleware);      // 1. Request-ID generieren
app.use(corsMiddleware);           // 2. CORS
app.use(rateLimitMiddleware);      // 3. Rate Limiting
app.use(authMiddleware);           // 4. JWT Validation
app.use(auditMiddleware);          // 5. Audit Trail
app.use(router);                   // 6. Routes
app.use(globalErrorHandler);       // 7. Error Handling
```

### Rate Limiting

```typescript
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100,                   // Max 100 Requests pro Fenster
  message: 'Too many requests, please try again later',
  // Stricter für sensible Endpoints
  sensitive: {
    windowMs: 5 * 60 * 1000,
    max: 10 // Login, Password Reset
  }
};
```

---

## Health Check Endpoint

```typescript
// GET /api/health — Immer offen (kein Auth)
app.get('/api/health', async (req, res) => {
  const checks = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION ?? 'unknown',
    checks: {
      database: await checkDatabase(),
      cache: 'ok' // MVP: immer ok (in-memory)
    }
  };
  
  const isHealthy = Object.values(checks.checks).every(c => c === 'ok');
  res.status(isHealthy ? 200 : 503).json(checks);
});
```

---

## Logging

```typescript
// Structured Logging
const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: 'json',
  fields: {
    service: 'aiva-health',
    version: process.env.APP_VERSION
  }
});

// Usage
logger.info('Appointment booked', {
  appointmentId: appointment.id,
  patientId: patient.id, // ID only, KEINE Klarnamen!
  provider: appointment.provider
});
```

---

## Cross-References

- **API Design** → [Convention 16: API Design](16-api-design.md)
- **Security** → [Convention 05: Security](../process-quality/05-security.md)
- **Architecture** → [Convention 03: Patterns](../code-architecture/03-patterns.md)
