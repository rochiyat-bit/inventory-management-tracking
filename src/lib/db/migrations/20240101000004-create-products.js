'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      unit: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pcs',
      },
      minStock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxStock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1000,
      },
      reorderPoint: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
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

    await queryInterface.addIndex('products', ['sku'], {
      unique: true,
      name: 'products_sku_unique',
    });

    await queryInterface.addIndex('products', ['barcode'], {
      unique: true,
      name: 'products_barcode_unique',
    });

    await queryInterface.addIndex('products', ['categoryId'], {
      name: 'products_categoryId_index',
    });

    await queryInterface.addIndex('products', ['status'], {
      name: 'products_status_index',
    });

    await queryInterface.addIndex('products', ['name'], {
      name: 'products_name_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
