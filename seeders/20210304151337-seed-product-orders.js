'use strict';

const data = require("../data/product-orders.json");

data.forEach(e => {
  if (!e.startDate.trim()) {
    e.startDate = null;
  }
  if (!e.endDate.trim()) {
    e.endDate = null;
  }
  e.materialCost = 0;
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ProductOrders", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ProductOrders", null, {});
  }
};
