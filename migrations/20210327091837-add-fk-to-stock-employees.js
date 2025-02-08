'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('StockEmployees', 'StockId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Stocks'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('StockEmployees', 'EmployeeId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Employees'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('StockEmployees', 'AdminId', {
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
      await queryInterface.removeColumn('StockEmployees', 'StockId', {}),
      await queryInterface.removeColumn('StockEmployees', 'EmployeeId', {}),
      await queryInterface.removeColumn('StockEmployees', 'AdminId', {})
    ]);
  }
};
