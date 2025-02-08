'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.addColumn('Materials', 'SizeCategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'SizeCategories'
        },
        key: 'id'
      }
      }),
      await queryInterface.addColumn('Materials', 'BrandCategoryId', {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'BrandCategories'
          },
          key: 'id'
        }
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      await queryInterface.removeColumn('Materials', 'SizeCategoryId', {}),
      await queryInterface.removeColumn('Materials', 'BrandCategoryId', {})
    ]);
  }
};
