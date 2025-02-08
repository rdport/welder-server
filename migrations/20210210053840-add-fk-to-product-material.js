'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('ProductMaterials', 'ProductOrderId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'ProductOrders'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductMaterials', 'MaterialId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Materials'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductMaterials', 'BrandId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Brands'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductMaterials', 'ShoppingId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Shoppings'
          },
          key: 'id'
        }
      }),
      await queryInterface.addColumn('ProductMaterials', 'AdminId', {
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
      await queryInterface.removeColumn('ProductMaterials', 'ProductOrderId', {}),
      await queryInterface.removeColumn('ProductMaterials', 'MaterialId', {}),
      await queryInterface.removeColumn('ProductMaterials', 'BrandId', {}),
      await queryInterface.removeColumn('ProductMaterials', 'ShoppingId', {}),
      await queryInterface.removeColumn('ProductMaterials', 'AdminId', {})
    ]);
  }
};
