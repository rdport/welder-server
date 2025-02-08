'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
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
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lon: {
        type: Sequelize.FLOAT
      },
      orderValue: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      confirmedOrderValue: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      productionCost: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      receivedPayment: {
        type: Sequelize.DECIMAL(10 ,2)
      },
      projectStatus: {
        type: Sequelize.STRING
      },
      paymentType: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.STRING
      },
      notes: {
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
    await queryInterface.dropTable('Orders');
  }
};