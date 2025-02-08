'use strict';

const data = require("../data/material-purchases.json");

data.forEach(e => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("MaterialPurchases", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("MaterialPurchases", null, {});
  }
};
