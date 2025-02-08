'use strict';

const data = require("../data/customers.json");

data.forEach(e => {
  if (!e.lastName.trim()) {
    e.lastName = e.firstName;
  }
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Customers", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Customers", null, {});
  }
};
