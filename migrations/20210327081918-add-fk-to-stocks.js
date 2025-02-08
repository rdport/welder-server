'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Stocks', 'MaterialId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Materials'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('Stocks', 'BrandId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Brands'
          },
          key: 'id'
        }
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.removeColumn('Stocks', 'MaterialId', {}),
      await queryInterface.removeColumn('Stocks', 'BrandId', {})
    ]);
  }
};
