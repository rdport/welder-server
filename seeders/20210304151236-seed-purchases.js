'use strict';

const data = require("../data/purchases.json");

data.forEach(e => {
  e.purchaseValue = 0;
  e.paidAmount = 0;
  e.purchaseStatus = 'unpaid';
  e.reportStatus = 'not reported';
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Purchases", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Purchases", null, {});
  }
};
