/**
 * Database Models Index
 * Sets up all models and their associations
 */

import User from './User';
import Category from './Category';
import Product from './Product';
import Warehouse from './Warehouse';
import Inventory from './Inventory';
import StockMovement from './StockMovement';
import AuditLog from './AuditLog';

/**
 * Model Associations
 * Define all relationships between models
 */

// Category self-reference (hierarchical)
Category.hasMany(Category, {
  as: 'subcategories',
  foreignKey: 'parentId',
});
Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId',
});

// Product belongs to Category
Product.belongsTo(Category, {
  as: 'category',
  foreignKey: 'categoryId',
});
Category.hasMany(Product, {
  as: 'products',
  foreignKey: 'categoryId',
});

// Warehouse managed by User
Warehouse.belongsTo(User, {
  as: 'manager',
  foreignKey: 'managerId',
});
User.hasMany(Warehouse, {
  as: 'managedWarehouses',
  foreignKey: 'managerId',
});

// Inventory relationships
Inventory.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
});
Product.hasMany(Inventory, {
  as: 'inventories',
  foreignKey: 'productId',
});

Inventory.belongsTo(Warehouse, {
  as: 'warehouse',
  foreignKey: 'warehouseId',
});
Warehouse.hasMany(Inventory, {
  as: 'inventories',
  foreignKey: 'warehouseId',
});

Inventory.belongsTo(User, {
  as: 'updater',
  foreignKey: 'updatedBy',
});

// StockMovement relationships
StockMovement.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
});
Product.hasMany(StockMovement, {
  as: 'stockMovements',
  foreignKey: 'productId',
});

StockMovement.belongsTo(User, {
  as: 'creator',
  foreignKey: 'createdBy',
});
User.hasMany(StockMovement, {
  as: 'createdMovements',
  foreignKey: 'createdBy',
});

StockMovement.belongsTo(Warehouse, {
  as: 'fromWarehouse',
  foreignKey: 'fromWarehouseId',
});

StockMovement.belongsTo(Warehouse, {
  as: 'toWarehouse',
  foreignKey: 'toWarehouseId',
});

// AuditLog relationships
AuditLog.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
});
User.hasMany(AuditLog, {
  as: 'auditLogs',
  foreignKey: 'userId',
});

/**
 * Export all models
 */
export {
  User,
  Category,
  Product,
  Warehouse,
  Inventory,
  StockMovement,
  AuditLog,
};

/**
 * Sync all models with database
 * WARNING: Only use in development
 */
export async function syncModels(force = false) {
  try {
    await User.sync({ force });
    await Category.sync({ force });
    await Warehouse.sync({ force });
    await Product.sync({ force });
    await Inventory.sync({ force });
    await StockMovement.sync({ force });
    await AuditLog.sync({ force });
    console.log('✅ All models synced successfully');
  } catch (error) {
    console.error('❌ Error syncing models:', error);
    throw error;
  }
}

export default {
  User,
  Category,
  Product,
  Warehouse,
  Inventory,
  StockMovement,
  AuditLog,
  syncModels,
};
