# 📡 API Documentation

Complete API reference for the Inventory Management System.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API requests (except login) require authentication via NextAuth.js session cookies.

### Headers

```http
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /api/auth/callback/credentials

Login with email and password.

**Request:**

```json
{
  "email": "admin@inventory.com",
  "password": "Admin123!"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "admin@inventory.com",
    "name": "System Administrator",
    "role": "admin"
  }
}
```

---

## Products

### GET /api/products

List all products with pagination and filtering.

**Query Parameters:**

- `search` (string, optional) - Search in name, SKU, or barcode
- `categoryId` (uuid, optional) - Filter by category
- `status` (enum, optional) - Filter by status (active/inactive)
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `sortBy` (enum, default: createdAt) - Sort field (name/sku/createdAt/updatedAt)
- `sortOrder` (enum, default: desc) - Sort order (asc/desc)

**Example:**

```http
GET /api/products?search=mouse&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "sku": "ELEC-001",
        "barcode": "8991234567001",
        "name": "Wireless Mouse Logitech M185",
        "description": "Wireless optical mouse with USB nano receiver",
        "categoryId": "uuid",
        "category": {
          "id": "uuid",
          "name": "Electronics"
        },
        "unit": "pcs",
        "minStock": 10,
        "maxStock": 100,
        "reorderPoint": 20,
        "imageUrl": null,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 22,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### POST /api/products

Create a new product. Requires authentication.

**Request:**

```json
{
  "sku": "ELEC-006",
  "barcode": "8991234567006",
  "name": "USB-C Cable 2m",
  "description": "High-speed USB-C to USB-C cable",
  "categoryId": "uuid",
  "unit": "pcs",
  "minStock": 20,
  "maxStock": 200,
  "reorderPoint": 40,
  "imageUrl": "https://example.com/image.jpg",
  "status": "active"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "ELEC-006",
    ...
  },
  "message": "Product created successfully"
}
```

**Notes:**
- If `barcode` is not provided, it will be auto-generated (EAN-13 format)
- SKU must be unique
- Barcode must be unique

### GET /api/products/[id]

Get a single product by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "ELEC-001",
    "barcode": "8991234567001",
    "name": "Wireless Mouse Logitech M185",
    "category": {
      "id": "uuid",
      "name": "Electronics"
    },
    ...
  }
}
```

### PUT /api/products/[id]

Update a product. Requires authentication.

**Request:**

```json
{
  "name": "Updated Product Name",
  "status": "inactive",
  "reorderPoint": 30
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Product updated successfully"
}
```

### DELETE /api/products/[id]

Soft delete a product. Requires authentication.

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Product deleted successfully"
}
```

---

## Categories

### GET /api/categories

List all categories with hierarchical support.

**Query Parameters:**

- `search` (string, optional) - Search in name or description
- `parentId` (uuid, optional) - Filter by parent category
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Electronics",
        "description": "Electronic devices and accessories",
        "parentId": null,
        "parent": null,
        "subcategories": [
          {
            "id": "uuid",
            "name": "Computers"
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### POST /api/categories

Create a new category. Requires authentication.

**Request:**

```json
{
  "name": "Computers",
  "description": "Desktop and laptop computers",
  "parentId": "uuid"
}
```

### GET /api/categories/[id]

Get a single category with parent and subcategories.

### PUT /api/categories/[id]

Update a category. Requires authentication.

### DELETE /api/categories/[id]

Soft delete a category. Requires authentication.

---

## Warehouses

### GET /api/warehouses

List all warehouses.

**Query Parameters:**

- `search` (string, optional)
- `managerId` (uuid, optional)
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "Main Warehouse",
        "code": "WH-001",
        "address": "Jl. Raya Industri No. 123, Jakarta Timur",
        "managerId": "uuid",
        "manager": {
          "id": "uuid",
          "name": "Warehouse Manager",
          "email": "manager@inventory.com"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### POST /api/warehouses

Create a warehouse. **Requires Manager or Admin role.**

**Request:**

```json
{
  "name": "North Warehouse",
  "code": "WH-003",
  "address": "Complete address here",
  "managerId": "uuid"
}
```

### GET /api/warehouses/[id]

Get warehouse details.

### PUT /api/warehouses/[id]

Update warehouse. **Requires Manager or Admin role.**

### DELETE /api/warehouses/[id]

Delete warehouse. **Requires Manager or Admin role.**

---

## Inventory

### GET /api/inventory

List inventory records with stock levels.

**Query Parameters:**

- `productId` (uuid, optional)
- `warehouseId` (uuid, optional)
- `lowStock` (boolean, optional) - Filter items below reorder point
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "productId": "uuid",
        "product": {
          "id": "uuid",
          "name": "Wireless Mouse",
          "sku": "ELEC-001",
          "barcode": "8991234567001",
          "minStock": 10,
          "reorderPoint": 20
        },
        "warehouseId": "uuid",
        "warehouse": {
          "id": "uuid",
          "name": "Main Warehouse",
          "code": "WH-001"
        },
        "quantity": 75,
        "locationCode": "A-5-12",
        "lastStockCheck": "2024-01-15T10:30:00.000Z",
        "updatedBy": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 44,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## Stock Movements

### GET /api/stock-movements

List stock movements with filtering.

**Query Parameters:**

- `productId` (uuid, optional)
- `type` (enum, optional) - in/out/adjustment/transfer
- `warehouseId` (uuid, optional) - Filter by source or destination warehouse
- `startDate` (datetime, optional)
- `endDate` (datetime, optional)
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (enum, default: createdAt) - createdAt/quantity/type
- `sortOrder` (enum, default: desc)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "productId": "uuid",
        "product": {
          "id": "uuid",
          "name": "Wireless Mouse",
          "sku": "ELEC-001",
          "barcode": "8991234567001"
        },
        "type": "transfer",
        "quantity": 10,
        "referenceNumber": "TRF-2024-001",
        "reason": "Stock redistribution",
        "fromWarehouseId": "uuid",
        "fromWarehouse": {
          "id": "uuid",
          "name": "Main Warehouse",
          "code": "WH-001"
        },
        "toWarehouseId": "uuid",
        "toWarehouse": {
          "id": "uuid",
          "name": "Secondary Warehouse",
          "code": "WH-002"
        },
        "createdBy": "uuid",
        "creator": {
          "id": "uuid",
          "name": "Warehouse Manager",
          "email": "manager@inventory.com"
        },
        "createdAt": "2024-01-15T14:30:00.000Z",
        "updatedAt": "2024-01-15T14:30:00.000Z"
      }
    ],
    "total": 127,
    "page": 1,
    "limit": 10,
    "totalPages": 13
  }
}
```

### POST /api/stock-movements

Create stock movement (adjustment or transfer). **Requires Manager or Admin role.**

#### Stock Adjustment

Increase or decrease stock at a warehouse.

**Request:**

```json
{
  "type": "adjustment",
  "productId": "uuid",
  "warehouseId": "uuid",
  "quantity": 10,
  "reason": "Physical count adjustment",
  "referenceNumber": "ADJ-2024-001"
}
```

**Notes:**
- Positive quantity = stock increase
- Negative quantity = stock decrease
- Uses database transaction for atomicity
- Automatically updates inventory record

#### Stock Transfer

Transfer stock between warehouses.

**Request:**

```json
{
  "type": "transfer",
  "productId": "uuid",
  "fromWarehouseId": "uuid",
  "toWarehouseId": "uuid",
  "quantity": 5,
  "reason": "Stock redistribution",
  "referenceNumber": "TRF-2024-001"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "movement": { ... },
    "sourceInventory": { ... },
    "destInventory": { ... }
  },
  "message": "Stock transferred successfully"
}
```

**Notes:**
- Validates sufficient stock at source
- Uses database transaction
- Creates/updates both source and destination inventory
- Fails if insufficient stock

---

## Error Examples

### Validation Error (422)

```json
{
  "success": false,
  "error": "Validation failed",
  "data": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": "Product not found"
}
```

### Conflict (409)

```json
{
  "success": false,
  "error": "A record with this value already exists"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW` environment variables
- Returns `429 Too Many Requests` when limit exceeded

## CORS

- Configured for same-origin by default
- Update Next.js config for cross-origin requests

## Audit Trail

All mutation operations (POST, PUT, DELETE) are automatically logged to the `audit_logs` table with:
- User ID
- Action type
- Entity type and ID
- Before/after changes (JSON)
- IP address
- Timestamp

---

For more information:
- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
