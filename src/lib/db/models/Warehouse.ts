import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { Warehouse as WarehouseType } from '@/types';

interface WarehouseCreationAttributes extends Optional<WarehouseType, 'id' | 'managerId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * Warehouse Model - Manages warehouse locations
 */
class Warehouse extends Model<WarehouseType, WarehouseCreationAttributes> implements WarehouseType {
  declare id: string;
  declare name: string;
  declare code: string;
  declare address: string;
  declare managerId?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    managerId: {
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
    tableName: 'warehouses',
    modelName: 'Warehouse',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['code'],
      },
      {
        fields: ['managerId'],
      },
    ],
  }
);

export default Warehouse;
