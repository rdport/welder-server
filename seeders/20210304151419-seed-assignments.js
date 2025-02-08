'use strict';

const data = require("../data/assignments.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Assignments", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Assignments", null, {});
  }
};
