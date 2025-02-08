'use strict';

const data = require("../data/internalTransactions.json");

data.forEach(e => {
  e.reportStatus = 'not reported';
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("InternalTransactions", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("InternalTransactions", null, {});
  }
};
