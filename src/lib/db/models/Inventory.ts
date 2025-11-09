import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { Inventory as InventoryType } from '@/types';

interface InventoryCreationAttributes extends Optional<InventoryType, 'id' | 'locationCode' | 'lastStockCheck' | 'updatedBy' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * Inventory Model - Tracks product quantities per warehouse
 */
class Inventory extends Model<InventoryType, InventoryCreationAttributes> implements InventoryType {
  declare id: string;
  declare productId: string;
  declare warehouseId: string;
  declare quantity: number;
  declare locationCode?: string;
  declare lastStockCheck?: Date;
  declare updatedBy?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    locationCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastStockCheck: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'inventories',
    modelName: 'Inventory',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['productId', 'warehouseId'],
        name: 'unique_product_warehouse',
      },
      {
        fields: ['productId'],
      },
      {
        fields: ['warehouseId'],
      },
      {
        fields: ['quantity'],
      },
    ],
  }
);

export default Inventory;
