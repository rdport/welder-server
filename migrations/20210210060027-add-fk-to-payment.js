'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Payments', 'OrderId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Orders'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Payments', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Payments', 'AdminId', {
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
      await queryInterface.removeColumn('Payments', 'OrderId', {}),
      await queryInterface.removeColumn('Payments', 'ReferenceId', {}),
      await queryInterface.removeColumn('Payments', 'AdminId', {})
    ]);
  }
};
