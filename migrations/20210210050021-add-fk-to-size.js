'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Sizes', 'SizeCategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'SizeCategories'
        },
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Sizes', 'SizeCategoryId', {});
  }
};
