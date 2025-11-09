import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { Product as ProductType } from '@/types';

interface ProductCreationAttributes extends Optional<ProductType, 'id' | 'description' | 'imageUrl' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * Product Model - Manages product information and inventory settings
 */
class Product extends Model<ProductType, ProductCreationAttributes> implements ProductType {
  declare id: string;
  declare sku: string;
  declare barcode: string;
  declare name: string;
  declare description?: string;
  declare categoryId: string;
  declare unit: string;
  declare minStock: number;
  declare maxStock: number;
  declare reorderPoint: number;
  declare imageUrl?: string;
  declare status: 'active' | 'inactive';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    barcode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pcs',
    },
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    maxStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      validate: {
        min: 0,
      },
    },
    reorderPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
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
    tableName: 'products',
    modelName: 'Product',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['sku'],
      },
      {
        unique: true,
        fields: ['barcode'],
      },
      {
        fields: ['categoryId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default Product;
