'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entityType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entityId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('audit_logs', ['userId'], {
      name: 'audit_logs_userId_index',
    });

    await queryInterface.addIndex('audit_logs', ['entityType'], {
      name: 'audit_logs_entityType_index',
    });

    await queryInterface.addIndex('audit_logs', ['entityId'], {
      name: 'audit_logs_entityId_index',
    });

    await queryInterface.addIndex('audit_logs', ['action'], {
      name: 'audit_logs_action_index',
    });

    await queryInterface.addIndex('audit_logs', ['timestamp'], {
      name: 'audit_logs_timestamp_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  },
};
