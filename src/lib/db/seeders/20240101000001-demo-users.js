'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const now = new Date();

    const users = [
      {
        id: uuidv4(),
        email: 'admin@inventory.com',
        password: await bcrypt.hash('Admin123!', salt),
        name: 'System Administrator',
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'manager@inventory.com',
        password: await bcrypt.hash('Manager123!', salt),
        name: 'Warehouse Manager',
        role: 'manager',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'staff@inventory.com',
        password: await bcrypt.hash('Staff123!', salt),
        name: 'Warehouse Staff',
        role: 'staff',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
