'use strict';

const data = require("../data/orders.json");

data.forEach(e => {
  e.orderValue = 0;
  e.confirmedOrderValue = 0;
  e.productionCost = 0;
  e.receivedPayment = 0;
  e.projectStatus = 'surveyed';
  e.paymentStatus = 'unpaid';
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Orders", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Orders", null, {});
  }
};
