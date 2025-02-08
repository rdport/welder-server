'use strict';

const data = require("../data/employees.json");

data.forEach(e => {
  if (!e.residentId.trim()) {
    e.residentId = null;
  }
  if (!e.lastName.trim()) {
    e.lastName = e.firstName;
  }
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Employees", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Employees", null, {});
  }
};
