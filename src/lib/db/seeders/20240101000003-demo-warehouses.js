'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Get manager user ID
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role = 'manager' LIMIT 1;`
    );
    const managerId = users[0]?.id || null;

    const warehouses = [
      {
        id: uuidv4(),
        name: 'Main Warehouse',
        code: 'WH-001',
        address: 'Jl. Raya Industri No. 123, Jakarta Timur, DKI Jakarta 13920',
        managerId: managerId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Secondary Warehouse',
        code: 'WH-002',
        address: 'Jl. Pergudangan Blok C No. 45, Tangerang, Banten 15710',
        managerId: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('warehouses', warehouses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warehouses', null, {});
  },
};
