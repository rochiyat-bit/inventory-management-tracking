import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../index';
import type { AuditLog as AuditLogType } from '@/types';

interface AuditLogCreationAttributes extends Optional<AuditLogType, 'id' | 'changes' | 'ipAddress'> {}

/**
 * AuditLog Model - Complete audit trail for all system changes
 */
class AuditLog extends Model<AuditLogType, AuditLogCreationAttributes> implements AuditLogType {
  declare id: string;
  declare userId: string;
  declare action: string;
  declare entityType: string;
  declare entityId: string;
  declare changes?: Record<string, unknown>;
  declare ipAddress?: string;
  declare readonly timestamp: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    modelName: 'AuditLog',
    timestamps: false,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['entityType'],
      },
      {
        fields: ['entityId'],
      },
      {
        fields: ['action'],
      },
      {
        fields: ['timestamp'],
      },
    ],
  }
);

export default AuditLog;
