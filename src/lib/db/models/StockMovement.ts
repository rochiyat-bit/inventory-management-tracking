import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { StockMovement as StockMovementType } from '@/types';

interface StockMovementCreationAttributes extends Optional<StockMovementType, 'id' | 'referenceNumber' | 'reason' | 'fromWarehouseId' | 'toWarehouseId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * StockMovement Model - Tracks all stock movements (in/out/adjustment/transfer)
 */
class StockMovement extends Model<StockMovementType, StockMovementCreationAttributes> implements StockMovementType {
  declare id: string;
  declare productId: string;
  declare type: 'in' | 'out' | 'adjustment' | 'transfer';
  declare quantity: number;
  declare referenceNumber?: string;
  declare reason?: string;
  declare fromWarehouseId?: string;
  declare toWarehouseId?: string;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

StockMovement.init(
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
    type: {
      type: DataTypes.ENUM('in', 'out', 'adjustment', 'transfer'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    referenceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fromWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    toWarehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
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
    tableName: 'stock_movements',
    modelName: 'StockMovement',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['productId'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['fromWarehouseId'],
      },
      {
        fields: ['toWarehouseId'],
      },
      {
        fields: ['createdBy'],
      },
      {
        fields: ['createdAt'],
      },
      {
        fields: ['referenceNumber'],
      },
    ],
  }
);

export default StockMovement;
