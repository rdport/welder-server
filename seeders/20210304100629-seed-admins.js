'use strict';

const data = require("../data/admins.json");
const { hash } = require("../helpers/bcrypt");

data.forEach(e => {
  if (!e.lastName.trim()) {
    e.lastName = e.firstName;
  }
  e.password = hash(e.password);
  e.createdAt = new Date();
  e.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Admins", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Admins", null, {});
  }
};
