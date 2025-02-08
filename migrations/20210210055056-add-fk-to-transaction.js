'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Transactions', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Transactions', 'AdminId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Admins'
          },
          key: 'id'
        }
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.removeColumn('Transactions', 'ReferenceId', {}),
      await queryInterface.removeColumn('Transactions', 'AdminId', {})
    ]);
  }
};
