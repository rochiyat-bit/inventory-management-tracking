'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_movements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      type: {
        type: Sequelize.ENUM('in', 'out', 'adjustment', 'transfer'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      referenceNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fromWarehouseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      toWarehouseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('stock_movements', ['productId'], {
      name: 'stock_movements_productId_index',
    });

    await queryInterface.addIndex('stock_movements', ['type'], {
      name: 'stock_movements_type_index',
    });

    await queryInterface.addIndex('stock_movements', ['fromWarehouseId'], {
      name: 'stock_movements_fromWarehouseId_index',
    });

    await queryInterface.addIndex('stock_movements', ['toWarehouseId'], {
      name: 'stock_movements_toWarehouseId_index',
    });

    await queryInterface.addIndex('stock_movements', ['createdBy'], {
      name: 'stock_movements_createdBy_index',
    });

    await queryInterface.addIndex('stock_movements', ['createdAt'], {
      name: 'stock_movements_createdAt_index',
    });

    await queryInterface.addIndex('stock_movements', ['referenceNumber'], {
      name: 'stock_movements_referenceNumber_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stock_movements');
  },
};
