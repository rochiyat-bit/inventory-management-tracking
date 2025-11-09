# 🗄️ Database Schema

Complete database schema for the Inventory Management System using PostgreSQL.

## Overview

The system uses **PostgreSQL 15+** with **Sequelize ORM** for data management.

### Key Features

- **ACID Transactions** for data integrity
- **Foreign Key Constraints** with proper cascade rules
- **Indexes** for performance optimization
- **Soft Deletes** (paranoid mode) on all main tables
- **JSONB** support for flexible data storage
- **Connection Pooling** for scalability

---

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │   Category   │◄───────┐│   Product   │
│             │         │              │        ││             │
│ - id        │         │ - id         │        ││ - id        │
│ - email     │         │ - name       │        ││ - sku       │
│ - password  │         │ - description│        ││ - barcode   │
│ - name      │         │ - parentId   ├────────┘│ - name      │
│ - role      │         │              │         │ - categoryId│
└──────┬──────┘         └──────────────┘         │ - unit      │
       │                                         │ - minStock  │
       │                ┌──────────────┐         │ - maxStock  │
       │                │  Warehouse   │         │ - reorderPt │
       │                │              │         │ - imageUrl  │
       │                │ - id         │         │ - status    │
       │                │ - name       │         └──────┬──────┘
       │                │ - code       │                │
       │        ┌───────┤ - address    │                │
       │        │       │ - managerId  │                │
       │        │       └──────┬───────┘                │
       │        │              │                        │
       │        │              │       ┌────────────────┤
       │        │              │       │                │
       │        │              ▼       ▼                │
       │        │       ┌──────────────────┐            │
       │        │       │    Inventory     │            │
       │        │       │                  │            │
       │        │       │ - id             │            │
       │        │       │ - productId      ├────────────┘
       │        │       │ - warehouseId    │
       │        │       │ - quantity       │
       │        │       │ - locationCode   │
       │        └───────┤ - updatedBy      │
       │                └──────────────────┘
       │
       │                ┌──────────────────┐
       │                │ StockMovement    │
       │                │                  │
       │                │ - id             │
       │                │ - productId      │
       │                │ - type           │
       │                │ - quantity       │
       │        ┌───────┤ - createdBy      │
       │        │       │ - fromWarehouseId│
       │        │       │ - toWarehouseId  │
       │        │       │ - referenceNo    │
       │        │       │ - reason         │
       │        │       └──────────────────┘
       │        │
       │        │       ┌──────────────────┐
       │        │       │   AuditLog       │
       │        │       │                  │
       │        │       │ - id             │
       └────────────────┤ - userId         │
                        │ - action         │
                        │ - entityType     │
                        │ - entityId       │
                        │ - changes (JSONB)│
                        │ - ipAddress      │
                        │ - timestamp      │
                        └──────────────────┘
```

---

## Tables

### 1. users

Stores user information with role-based access control.

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Fields:**
- `id` - UUID primary key
- `email` - Unique email address for login
- `password` - Hashed password (bcrypt, 10 rounds)
- `name` - Full name of the user
- `role` - Access level: admin, manager, or staff
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp (NULL if active)

**Constraints:**
- UNIQUE: email
- NOT NULL: email, password, name, role

---

### 2. categories

Hierarchical product categories with self-reference.

```sql
CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    parent_id       UUID NULL REFERENCES categories(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_name ON categories(name);
```

**Fields:**
- `id` - UUID primary key
- `name` - Category name
- `description` - Optional description
- `parent_id` - Reference to parent category (NULL for root categories)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Relationships:**
- Self-referencing: parent_id → categories.id
- CASCADE: Updates propagate to children
- SET NULL: On parent delete, children become root categories

---

### 3. warehouses

Physical warehouse locations.

```sql
CREATE TABLE warehouses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(10) NOT NULL UNIQUE,
    address         TEXT NOT NULL,
    manager_id      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL
);

CREATE UNIQUE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_warehouses_manager_id ON warehouses(manager_id);
```

**Fields:**
- `id` - UUID primary key
- `name` - Warehouse name
- `code` - Unique warehouse code (e.g., "WH-001")
- `address` - Physical address
- `manager_id` - Reference to managing user (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Constraints:**
- UNIQUE: code
- NOT NULL: name, code, address

---

### 4. products

Product master data.

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku             VARCHAR(50) NOT NULL UNIQUE,
    barcode         VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    unit            VARCHAR(20) NOT NULL DEFAULT 'pcs',
    min_stock       INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    max_stock       INTEGER NOT NULL DEFAULT 1000 CHECK (max_stock >= 0),
    reorder_point   INTEGER NOT NULL DEFAULT 10 CHECK (reorder_point >= 0),
    image_url       VARCHAR(255) NULL,
    status          ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL
);

CREATE UNIQUE INDEX idx_products_sku ON products(sku);
CREATE UNIQUE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_name ON products(name);
```

**Fields:**
- `id` - UUID primary key
- `sku` - Stock Keeping Unit (unique identifier)
- `barcode` - EAN-13 or other barcode format (unique)
- `name` - Product name
- `description` - Detailed description (optional)
- `category_id` - Reference to category
- `unit` - Unit of measurement (pcs, box, kg, etc.)
- `min_stock` - Minimum stock level
- `max_stock` - Maximum stock level
- `reorder_point` - Threshold for reordering
- `image_url` - Product image URL (optional)
- `status` - Active or inactive
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Constraints:**
- UNIQUE: sku, barcode
- NOT NULL: sku, barcode, name, category_id, unit
- CHECK: min_stock >= 0, max_stock >= 0, reorder_point >= 0
- RESTRICT: Cannot delete category if products exist

---

### 5. inventories

Current stock levels per product per warehouse.

```sql
CREATE TABLE inventories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    warehouse_id    UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    quantity        INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    location_code   VARCHAR(50) NULL,
    last_stock_check TIMESTAMP NULL,
    updated_by      UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL,
    CONSTRAINT unique_product_warehouse UNIQUE (product_id, warehouse_id)
);

CREATE UNIQUE INDEX idx_inventories_product_warehouse ON inventories(product_id, warehouse_id);
CREATE INDEX idx_inventories_product_id ON inventories(product_id);
CREATE INDEX idx_inventories_warehouse_id ON inventories(warehouse_id);
CREATE INDEX idx_inventories_quantity ON inventories(quantity);
```

**Fields:**
- `id` - UUID primary key
- `product_id` - Reference to product
- `warehouse_id` - Reference to warehouse
- `quantity` - Current stock quantity
- `location_code` - Bin/shelf location (e.g., "A-5-12")
- `last_stock_check` - Last physical count timestamp
- `updated_by` - User who last updated (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Constraints:**
- UNIQUE: (product_id, warehouse_id) - One inventory record per product per warehouse
- NOT NULL: product_id, warehouse_id, quantity
- CHECK: quantity >= 0
- RESTRICT: Cannot delete product/warehouse if inventory exists

---

### 6. stock_movements

Complete history of all stock transactions.

```sql
CREATE TABLE stock_movements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    type            ENUM('in', 'out', 'adjustment', 'transfer') NOT NULL,
    quantity        INTEGER NOT NULL CHECK (quantity >= 1),
    reference_number VARCHAR(50) NULL,
    reason          TEXT NULL,
    from_warehouse_id UUID NULL REFERENCES warehouses(id) ON DELETE SET NULL,
    to_warehouse_id UUID NULL REFERENCES warehouses(id) ON DELETE SET NULL,
    created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMP NULL
);

CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);
CREATE INDEX idx_stock_movements_from_warehouse_id ON stock_movements(from_warehouse_id);
CREATE INDEX idx_stock_movements_to_warehouse_id ON stock_movements(to_warehouse_id);
CREATE INDEX idx_stock_movements_created_by ON stock_movements(created_by);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_reference_number ON stock_movements(reference_number);
```

**Fields:**
- `id` - UUID primary key
- `product_id` - Reference to product
- `type` - Movement type:
  - `in` - Stock receiving
  - `out` - Stock dispatch
  - `adjustment` - Manual adjustment (count, damage, etc.)
  - `transfer` - Transfer between warehouses
- `quantity` - Quantity moved (always positive)
- `reference_number` - External reference (PO, DO, etc.)
- `reason` - Reason for movement
- `from_warehouse_id` - Source warehouse (for out/transfer)
- `to_warehouse_id` - Destination warehouse (for in/transfer)
- `created_by` - User who created the movement
- `created_at` - Movement timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Constraints:**
- NOT NULL: product_id, type, quantity, created_by
- CHECK: quantity >= 1
- RESTRICT: Cannot delete product/user if movements exist

**Business Rules:**
- `in`: to_warehouse_id required
- `out`: from_warehouse_id required
- `adjustment`: from_warehouse_id or to_warehouse_id required
- `transfer`: both from_warehouse_id and to_warehouse_id required

---

### 7. audit_logs

Immutable audit trail for all system changes.

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    changes         JSONB NULL,
    ip_address      VARCHAR(45) NULL,
    timestamp       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

**Fields:**
- `id` - UUID primary key
- `user_id` - User who performed the action
- `action` - Action type (CREATE, UPDATE, DELETE, STOCK_ADJUSTMENT, STOCK_TRANSFER)
- `entity_type` - Type of entity modified (Product, Category, etc.)
- `entity_id` - ID of the modified entity
- `changes` - JSONB field with before/after values
- `ip_address` - IP address of the user
- `timestamp` - When the action occurred

**Constraints:**
- NOT NULL: user_id, action, entity_type, entity_id, timestamp
- NO UPDATES: Table is append-only for audit integrity
- NO SOFT DELETES: Permanent record

**JSONB Structure:**

```json
{
  "old": { "quantity": 50, "status": "active" },
  "new": { "quantity": 45, "status": "active" }
}
```

---

## Indexes Summary

### Performance Indexes

- **users**: email (unique), role
- **categories**: parent_id, name
- **warehouses**: code (unique), manager_id
- **products**: sku (unique), barcode (unique), category_id, status, name
- **inventories**: (product_id, warehouse_id) unique, product_id, warehouse_id, quantity
- **stock_movements**: product_id, type, warehouses, created_by, created_at, reference_number
- **audit_logs**: user_id, entity_type, entity_id, action, timestamp

### Index Strategy

- **Unique indexes** prevent duplicates
- **Foreign key indexes** optimize joins
- **Search indexes** speed up WHERE clauses
- **Composite indexes** for multi-column queries

---

## Data Integrity

### Foreign Key Rules

```
users.id ←── warehouses.manager_id (ON DELETE SET NULL)
users.id ←── inventories.updated_by (ON DELETE SET NULL)
users.id ←── stock_movements.created_by (ON DELETE RESTRICT)
users.id ←── audit_logs.user_id (ON DELETE RESTRICT)

categories.id ←── categories.parent_id (ON DELETE SET NULL)
categories.id ←── products.category_id (ON DELETE RESTRICT)

warehouses.id ←── inventories.warehouse_id (ON DELETE RESTRICT)
warehouses.id ←── stock_movements.from_warehouse_id (ON DELETE SET NULL)
warehouses.id ←── stock_movements.to_warehouse_id (ON DELETE SET NULL)

products.id ←── inventories.product_id (ON DELETE RESTRICT)
products.id ←── stock_movements.product_id (ON DELETE RESTRICT)
```

### Cascade Rules

- **ON DELETE RESTRICT**: Prevents deletion if referenced (products, warehouses in use)
- **ON DELETE SET NULL**: Nullifies reference (managers, optional fields)
- **ON DELETE CASCADE**: Not used to prevent accidental data loss

### Check Constraints

- `products.min_stock >= 0`
- `products.max_stock >= 0`
- `products.reorder_point >= 0`
- `inventories.quantity >= 0`
- `stock_movements.quantity >= 1`

---

## Sequelize Models

All models are defined with:

```typescript
{
  timestamps: true,        // Auto createdAt/updatedAt
  paranoid: true,          // Soft deletes (deletedAt)
  underscored: true,       // Snake case columns
  tableName: 'table_name', // Explicit table name
}
```

---

## Migration Strategy

### Running Migrations

```bash
# Run all pending migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Reset database (dev only)
npm run db:reset
```

### Migration Files

Located in `src/lib/db/migrations/`:

1. `20240101000001-create-users.js`
2. `20240101000002-create-categories.js`
3. `20240101000003-create-warehouses.js`
4. `20240101000004-create-products.js`
5. `20240101000005-create-inventories.js`
6. `20240101000006-create-stock-movements.js`
7. `20240101000007-create-audit-logs.js`

---

## Seeding Data

### Running Seeders

```bash
# Seed all demo data
npm run db:seed

# Undo all seeds
npm run db:seed:undo
```

### Demo Data Includes

- 3 users (admin, manager, staff)
- 5 categories (Electronics, Furniture, Stationery, Tools, Clothing)
- 22 sample products
- 2 warehouses
- Auto-generated inventory records

---

## Performance Considerations

### Connection Pooling

```javascript
pool: {
  max: 10,      // Maximum connections
  min: 2,       // Minimum connections
  acquire: 30000, // Max time to get connection (ms)
  idle: 10000   // Max idle time (ms)
}
```

### Query Optimization

- Use indexes for frequently queried columns
- Use `findAndCountAll` for paginated queries
- Include only necessary fields with `attributes`
- Use eager loading with `include` for related data
- Avoid N+1 queries with proper includes

### Backup Strategy

- Daily automated backups
- Point-in-time recovery enabled
- Backup retention: 30 days
- Test restore procedure monthly

---

For more information:
- [Architecture](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
