'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Orders', 'CustomerId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Customers'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Orders', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Orders', 'AdminId', {
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
      await queryInterface.removeColumn('Orders', 'CustomerId', {}),
      await queryInterface.removeColumn('Orders', 'ReferenceId', {}),
      await queryInterface.removeColumn('Orders', 'AdminId', {})
    ]);
  }
};
