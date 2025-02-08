'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('MaterialPurchases', 'MaterialId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Materials'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('MaterialPurchases', 'BrandId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Brands'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('MaterialPurchases', 'PurchaseId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Purchases'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('MaterialPurchases', 'DivisionId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Divisions'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('MaterialPurchases', 'StockId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Stocks'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('MaterialPurchases', 'AdminId', {
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
      await queryInterface.removeColumn('MaterialPurchases', 'MaterialId', {}),
      await queryInterface.removeColumn('MaterialPurchases', 'BrandId', {}),
      await queryInterface.removeColumn('MaterialPurchases', 'PurchaseId', {}),
      await queryInterface.removeColumn('MaterialPurchases', 'DivisionId', {}),
      await queryInterface.removeColumn('MaterialPurchases', 'StockId', {}),
      await queryInterface.removeColumn('MaterialPurchases', 'AdminId', {})
    ]);
  }
};
