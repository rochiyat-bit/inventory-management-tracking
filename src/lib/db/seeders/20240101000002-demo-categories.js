'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const categories = [
      {
        id: uuidv4(),
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Furniture',
        description: 'Office and home furniture',
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Stationery',
        description: 'Office supplies and stationery items',
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Tools',
        description: 'Hardware tools and equipment',
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Clothing',
        description: 'Apparel and accessories',
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
