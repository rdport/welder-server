'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('ProductOrders', 'ProductId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Products'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductOrders', 'OrderId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Orders'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductOrders', 'AdminId', {
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
      await queryInterface.removeColumn('ProductOrders', 'ProductId', {}),
      await queryInterface.removeColumn('ProductOrders', 'OrderId', {}),
      await queryInterface.removeColumn('ProductOrders', 'AdminId', {})
    ]);
  }
};
