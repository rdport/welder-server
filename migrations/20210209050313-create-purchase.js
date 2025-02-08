'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      notes: {
        type: Sequelize.STRING
      },
      purchaseValue: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      paidAmount: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      purchaseStatus: {
        type: Sequelize.STRING
      },
      reportStatus: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Purchases');
  }
};