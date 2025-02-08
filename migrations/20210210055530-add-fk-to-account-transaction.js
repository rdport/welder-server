'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('AccountTransactions', 'AccountId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Accounts'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('AccountTransactions', 'TransactionId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Transactions'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('AccountTransactions', 'AdminId', {
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
      await queryInterface.removeColumn('AccountTransactions', 'AccountId', {}),
      await queryInterface.removeColumn('AccountTransactions', 'TransactionId', {}),
      await queryInterface.removeColumn('AccountTransactions', 'AdminId', {})
    ]);
  }
};
