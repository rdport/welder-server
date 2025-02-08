'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      surveyDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      endDate: {
        type: Sequelize.DATEONLY
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      area: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      unitPrice: {
        allowNull: false,
        type: Sequelize.DECIMAL(10 ,2)
      },
      materialCost: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      laborCost: {
        allowNull: false,
        type: Sequelize.DECIMAL(10 ,2)
      },
      electricityCost: {
        allowNull: false,
        type: Sequelize.DECIMAL(10 ,2)
      },
      otherCost: {
        allowNull: false,
        type: Sequelize.DECIMAL(10 ,2)
      },
      commissionRate: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      productionStatus: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ProductOrders');
  }
};