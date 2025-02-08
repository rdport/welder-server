'use strict';

const data = require("../data/product-materials.json");

data.forEach(e => {
  e.ShoppingId = 1;
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ProductMaterials", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ProductMaterials", null, {});
  }
};
