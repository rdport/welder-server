'use strict';

const data = require("../data/sizeCategories.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("SizeCategories", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SizeCategories", null, {});
  }
};
