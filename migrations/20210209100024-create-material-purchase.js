'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MaterialPurchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING
      },
      correctedSize: {
        type: Sequelize.STRING
      },
      thickness: {
        type: Sequelize.STRING
      },
      correctedThickness: {
        type: Sequelize.STRING
      },
      unitPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10 ,2)
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      orderIndex: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MaterialPurchases');
  }
};