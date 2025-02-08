'use strict';

const data = require("../data/brandCategories.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("BrandCategories", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("BrandCategories", null, {});
  }
};
