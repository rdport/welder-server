'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order);
      Payment.belongsTo(models.Reference);
      Payment.belongsTo(models.Admin);
    }
  };
  Payment.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Title is required'
        },
        notEmpty: {
          args: true,
          msg: 'Title is required'
        }
      }
    },
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
    paymentValue: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Payment value is required'
        },
        isNumeric: {
          args: true,
          msg: 'Payment value must be numeric'
        },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('Payment value must be greater than 0');
          }
        }
      }
    },
    notes: DataTypes.STRING,
    reportStatus: DataTypes.STRING,
    OrderId: getAssociationValidation('Order Id', DataTypes)
  }, {
    sequelize,
    modelName: 'Payment',
  });

  Payment.beforeCreate((instance, options) => {
    instance.reportStatus = 'not reported';
  });

  return Payment;
};