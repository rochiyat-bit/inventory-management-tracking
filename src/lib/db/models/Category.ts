import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { Category as CategoryType } from '@/types';

interface CategoryCreationAttributes extends Optional<CategoryType, 'id' | 'description' | 'parentId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * Category Model - Hierarchical product categories with self-reference
 */
class Category extends Model<CategoryType, CategoryCreationAttributes> implements CategoryType {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare parentId?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Category.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
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
    tableName: 'categories',
    modelName: 'Category',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['parentId'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default Category;
