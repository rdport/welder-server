'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Purchases', 'SupplierId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Suppliers'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Purchases', 'ReferenceId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'References'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Purchases', 'DivisionId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Divisions'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Purchases', 'AdminId', {
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
      await queryInterface.removeColumn('Purchases', 'SupplierId', {}),
      await queryInterface.removeColumn('Purchases', 'ReferenceId', {}),
      await queryInterface.removeColumn('Purchases', 'DivisionId', {}),
      await queryInterface.removeColumn('Purchases', 'AdminId', {})
    ]);
  }
};
