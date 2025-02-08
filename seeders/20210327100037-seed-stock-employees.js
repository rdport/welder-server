'use strict';

const data = require("../data/stock-employees.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("StockEmployees", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("StockEmployees", null, {});
  }
};
