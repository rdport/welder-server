'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('GeneralTransactions', 'DatebookId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Datebooks'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('GeneralTransactions', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('GeneralTransactions', 'AdminId', {
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
      await queryInterface.removeColumn('GeneralTransactions', 'DatebookId', {}),
      await queryInterface.removeColumn('GeneralTransactions', 'ReferenceId', {}),
      await queryInterface.removeColumn('GeneralTransactions', 'AdminId', {})
    ]);
  }
};
