'use strict';

const data = require("../data/shoppings.json");

data.forEach(e => {
  if (!e.date.trim()) {
    e.date = null;
  }
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Shoppings", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Shoppings", null, {});
  }
};
