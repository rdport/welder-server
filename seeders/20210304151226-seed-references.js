'use strict';

const data = require("../data/references.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("References", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("References", null, {});
  }
};
