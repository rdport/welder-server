'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tokens', 'AdminId', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Admins'
        },
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tokens', 'AdminId', {});
  }
};
