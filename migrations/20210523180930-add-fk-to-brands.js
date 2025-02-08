'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Brands', 'BrandCategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'BrandCategories'
        },
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Brands', 'BrandCategoryId', {});
  }
};
