'use strict';

const data = require("../data/materials.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Materials", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Materials", null, {});
  }
};
