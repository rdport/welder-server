'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Assignments', 'EmployeeId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Employees'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Assignments', 'ProductOrderId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'ProductOrders'
          },
          key: 'id'
        }
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.removeColumn('Assignments', 'EmployeeId', {}),
      await queryInterface.removeColumn('Assignments', 'ProductOrderId', {})
    ]);
  }
};
