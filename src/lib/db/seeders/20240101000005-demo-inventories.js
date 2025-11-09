'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Get product IDs
    const [products] = await queryInterface.sequelize.query(`SELECT id FROM products;`);

    // Get warehouse IDs
    const [warehouses] = await queryInterface.sequelize.query(`SELECT id FROM warehouses;`);

    if (products.length === 0 || warehouses.length === 0) {
      console.log('No products or warehouses found. Skipping inventory seeding.');
      return;
    }

    const inventories = [];

    // Create inventory records for each product in both warehouses
    products.forEach((product) => {
      warehouses.forEach((warehouse, index) => {
        // Main warehouse gets more stock
        const quantity = index === 0 ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 50) + 10;

        inventories.push({
          id: uuidv4(),
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: quantity,
          locationCode: `${index === 0 ? 'A' : 'B'}-${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 20) + 1}`,
          lastStockCheck: now,
          updatedBy: null,
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    await queryInterface.bulkInsert('inventories', inventories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventories', null, {});
  },
};
