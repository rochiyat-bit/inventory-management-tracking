import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { User as UserType } from '@/types';

interface UserCreationAttributes extends Optional<UserType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * User Model - Manages system users with role-based access
 */
class User extends Model<UserType, UserCreationAttributes> implements UserType {
  declare id: string;
  declare email: string;
  declare password: string;
  declare name: string;
  declare role: 'admin' | 'manager' | 'staff';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'staff'),
      allowNull: false,
      defaultValue: 'staff',
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
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['role'],
      },
    ],
  }
);

export default User;
