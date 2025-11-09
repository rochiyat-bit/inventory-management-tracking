/**
 * Core TypeScript type definitions for the Inventory Management System
 */

export type UserRole = 'admin' | 'manager' | 'staff';

export type ProductStatus = 'active' | 'inactive';

export type StockMovementType = 'in' | 'out' | 'adjustment' | 'transfer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  imageUrl?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Inventory {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  locationCode?: string;
  lastStockCheck?: Date;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  referenceNumber?: string;
  reason?: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProductFormData {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  unit: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  imageUrl?: string;
  status: ProductStatus;
}
