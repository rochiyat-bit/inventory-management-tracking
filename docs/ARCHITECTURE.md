# 🏗️ System Architecture

## Overview

The Inventory Management System is built using a modern, scalable architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Browser   │  │    Mobile    │  │   Tablet     │       │
│  │  (Next.js)  │  │  (Next.js)   │  │  (Next.js)   │       │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                │                  │                │
└─────────┼────────────────┼──────────────────┼────────────────┘
          │                │                  │
┌─────────┼────────────────┼──────────────────┼────────────────┐
│         ▼                ▼                  ▼                │
│              Next.js App Router (SSR/CSR)                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages/UI   │  │ Components   │  │    Hooks     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                          │
┌──────────────────────────┼───────────────────────────────────┐
│         API Layer        ▼                                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           NextAuth.js Authentication                  │   │
│  │        (JWT-based Session Management)                 │   │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │              RBAC Middleware                           │  │
│  │    (Admin / Manager / Staff Authorization)             │  │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │          API Route Handlers                            │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────────┐    │  │
│  │  │ Products │ │ Categories │ │ Stock Movements  │    │  │
│  │  └──────────┘ └────────────┘ └──────────────────┘    │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────────┐    │  │
│  │  │Warehouses│ │ Inventory  │ │    Reports       │    │  │
│  │  └──────────┘ └────────────┘ └──────────────────┘    │  │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────────────┐
│    Business Logic     ▼                                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Zod Validation Layer                     │   │
│  │     (Schema-based Input Validation)                   │   │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │            Service Layer                               │  │
│  │  ┌───────────┐ ┌────────────┐ ┌──────────────────┐   │  │
│  │  │  Barcode  │ │   Audit    │ │   Stock Mgmt     │   │  │
│  │  │ Generator │ │  Logging   │ │   Operations     │   │  │
│  │  └───────────┘ └────────────┘ └──────────────────┘   │  │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────────────┐
│   Data Access Layer   ▼                                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Sequelize ORM                            │   │
│  │     (Object-Relational Mapping)                       │   │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼──────────────────────────────────┐  │
│  │          Database Models                               │  │
│  │  ┌──────┐ ┌────────┐ ┌─────────┐ ┌────────────────┐  │  │
│  │  │ User │ │Product │ │Category │ │ StockMovement  │  │  │
│  │  └──────┘ └────────┘ └─────────┘ └────────────────┘  │  │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────────────┐    │  │
│  │  │Warehouse │ │ Inventory │ │   AuditLog       │    │  │
│  │  └──────────┘ └───────────┘ └──────────────────┘    │  │
│  └────────────────────┬──────────────────────────────────┘  │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              PostgreSQL Database                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database Tables                          │   │
│  │  • users               • products                     │   │
│  │  • categories          • warehouses                   │   │
│  │  • inventories         • stock_movements              │   │
│  │  • audit_logs                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database Features                        │   │
│  │  • ACID Transactions   • Foreign Key Constraints      │   │
│  │  • Indexes             • Soft Deletes (Paranoid)      │   │
│  │  • JSONB Support       • Connection Pooling           │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15.0.3 (App Router)
- **React**: 19.0.0
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + Server Components
- **Charts**: Recharts 2.x

### Backend
- **Framework**: Next.js API Routes
- **ORM**: Sequelize 6.37+
- **Database**: PostgreSQL 15+
- **Authentication**: NextAuth.js v5
- **Validation**: Zod 3.23+
- **Session**: JWT-based

### Barcode
- **Generator**: jsbarcode 3.11+
- **Scanner**: react-barcode-reader
- **Format**: EAN-13

### Testing
- **Framework**: Jest 29.x
- **Testing Library**: React Testing Library 16.x
- **Coverage**: 70%+ target

## Data Flow

### 1. Request Flow

```
User Action
    ↓
Client Component (React)
    ↓
API Route Handler (/api/*)
    ↓
Authentication Middleware (NextAuth)
    ↓
Authorization Middleware (RBAC)
    ↓
Validation (Zod Schema)
    ↓
Business Logic (Services)
    ↓
Database Operations (Sequelize)
    ↓
PostgreSQL Database
    ↓
Response (JSON)
    ↓
Client Component Update
    ↓
UI Render
```

### 2. Authentication Flow

```
User Login
    ↓
POST /api/auth/[...nextauth]
    ↓
Credentials Provider
    ↓
Validate Email/Password
    ↓
Query User from Database
    ↓
Verify Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Store in HTTP-only Cookie
    ↓
Return Session Object
```

### 3. Stock Movement Flow

```
Stock Adjustment Request
    ↓
Validate Request (Zod)
    ↓
Start Database Transaction
    ↓
Lock Inventory Record
    ↓
Check Stock Availability
    ↓
Update Inventory Quantity
    ↓
Create Stock Movement Record
    ↓
Create Audit Log
    ↓
Commit Transaction
    ↓
Return Success Response
```

## Security Architecture

### Authentication
- JWT-based session management
- HTTP-only cookies for token storage
- Secure password hashing with bcrypt (10 rounds)
- Session expiration (configurable, default: 24 hours)

### Authorization
- Role-based access control (RBAC)
- Three roles: Admin, Manager, Staff
- Middleware-based permission checks
- Resource-level access control

### Data Security
- Input validation with Zod schemas
- SQL injection prevention (Sequelize parameterized queries)
- XSS protection (Next.js built-in)
- CSRF tokens (NextAuth.js)
- Audit trail for all critical operations

### API Security
- Rate limiting (configurable)
- Request size limits
- CORS configuration
- IP address logging

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema information.

## Scalability Considerations

### Current Implementation
- Connection pooling (5-10 connections)
- Server-side pagination
- Indexed database queries
- Optimized SQL queries with proper joins

### Future Enhancements
- Redis caching layer
- Read replicas for reporting
- CDN for static assets
- Horizontal scaling with load balancer
- Microservices architecture for high load

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Load Balancer                       │
│                   (HTTPS/SSL)                        │
└──────────────┬─────────────────┬────────────────────┘
               │                 │
       ┌───────▼────────┐ ┌─────▼──────────┐
       │  Next.js App   │ │  Next.js App   │
       │   Instance 1   │ │   Instance 2   │
       └───────┬────────┘ └─────┬──────────┘
               │                │
               └────────┬───────┘
                        │
              ┌─────────▼──────────┐
              │  PostgreSQL DB     │
              │  (Primary)         │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │  PostgreSQL DB     │
              │  (Replica - Read)  │
              └────────────────────┘
```

## Performance Optimization

### Database
- Proper indexing on frequently queried columns
- Compound indexes for multi-column queries
- Query optimization with EXPLAIN ANALYZE
- Database connection pooling

### API
- Response caching with revalidation
- Efficient pagination
- Lazy loading of related data
- Debounced search queries

### Frontend
- Server Components for initial load
- Client Components only when needed
- Image optimization with next/image
- Code splitting and lazy loading
- React.memo for expensive components

## Monitoring & Logging

### Application Logs
- Winston logger for structured logging
- Log levels: error, warn, info, debug
- Log rotation and archival
- Centralized log management (future)

### Audit Trail
- All CRUD operations logged
- User actions tracked
- IP address recording
- Change history (before/after)
- Immutable audit logs

### Metrics (Future)
- Request/response times
- Error rates
- Database query performance
- User activity metrics

## Development Workflow

```
Development → Testing → Staging → Production

Each environment has:
- Separate database
- Environment-specific configuration
- Isolated deployments
```

## API Design Principles

1. **RESTful**: Standard HTTP methods and status codes
2. **Consistent**: Uniform response format across all endpoints
3. **Secure**: Authentication and authorization on all mutation endpoints
4. **Validated**: Input validation on all requests
5. **Documented**: Comprehensive API documentation
6. **Versioned**: API versioning strategy (future)

## Error Handling Strategy

```
Error Occurrence
    ↓
Centralized Error Handler
    ↓
Log Error Details
    ↓
Sanitize Error Message
    ↓
Return Appropriate HTTP Status
    ↓
Client Error Handling
    ↓
User-Friendly Message
```

## Testing Strategy

- **Unit Tests**: Services, utilities, helpers
- **Integration Tests**: API routes, database operations
- **E2E Tests**: Critical user flows (future)
- **Coverage Target**: 70%+ code coverage

---

For more information:
- [API Documentation](./API.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
