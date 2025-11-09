'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
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
      warehouseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      locationCode: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      lastStockCheck: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('inventories', ['productId', 'warehouseId'], {
      unique: true,
      name: 'unique_product_warehouse',
    });

    await queryInterface.addIndex('inventories', ['productId'], {
      name: 'inventories_productId_index',
    });

    await queryInterface.addIndex('inventories', ['warehouseId'], {
      name: 'inventories_warehouseId_index',
    });

    await queryInterface.addIndex('inventories', ['quantity'], {
      name: 'inventories_quantity_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  },
};
