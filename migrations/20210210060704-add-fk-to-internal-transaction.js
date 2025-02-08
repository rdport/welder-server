'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('InternalTransactions', 'EmployeeId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Employees'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('InternalTransactions', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('InternalTransactions', 'AdminId', {
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
      await queryInterface.removeColumn('InternalTransactions', 'EmployeeId', {}),
      await queryInterface.removeColumn('InternalTransactions', 'ReferenceId', {}),
      await queryInterface.removeColumn('InternalTransactions', 'AdminId', {})
    ]);
  }
};
