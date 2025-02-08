'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer);
      Order.belongsTo(models.Reference);
      Order.belongsTo(models.Admin);
      Order.hasMany(models.ProductOrder);
      Order.hasMany(models.Payment);
    }
  };
  Order.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Date is required'
        },
        notEmpty: {
          args: true,
          msg: 'Date is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Address is required'
        },
        notEmpty: {
          args: true,
          msg: 'Address is required'
        }
      }
    },
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    orderValue: DataTypes.DECIMAL(10 ,2),
    confirmedOrderValue: DataTypes.DECIMAL(10 ,2),
    productionCost: DataTypes.DECIMAL(10 ,2),
    receivedPayment: DataTypes.DECIMAL(10 ,2),
    projectStatus: DataTypes.STRING,
    paymentType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Payment type is required'
        },
        notEmpty: {
          args: true,
          msg: 'Payment type is required'
        },
        isIn: {
          args: [['full', 'installment']],
          msg: 'Payment type is invalid'
        }
      }
    },
    paymentStatus: DataTypes.STRING,
    notes: DataTypes.STRING,
    CustomerId: getAssociationValidation('Customer Id', DataTypes)
  }, {
    sequelize,
    modelName: 'Order',
  });

  Order.beforeCreate((instance, options) => {
    instance.orderValue = 0.00;
    instance.confirmedOrderValue = 0.00;
    instance.productionCost = 0.00;
    instance.receivedPayment = 0.00;
    instance.projectStatus = 'surveyed';
    instance.paymentStatus = 'unpaid';
  });

  return Order;
};