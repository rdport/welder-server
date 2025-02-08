'use strict';

const data = require("../data/generalTransactions.json");

data.forEach(e => {
  e.reportStatus = 'not reported';
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("GeneralTransactions", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("GeneralTransactions", null, {});
  }
};
