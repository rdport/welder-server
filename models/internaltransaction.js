'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternalTransaction extends Model {
    static associate(models) {
      InternalTransaction.belongsTo(models.Employee);
      InternalTransaction.belongsTo(models.Reference);
      InternalTransaction.belongsTo(models.Admin);
    }
  };
  InternalTransaction.init({
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
    value: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Value is required'
        },
        isNumeric: {
          args: true,
          msg: 'Value must be numeric'
        },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('Value must be greater than 0');
          }
        }
      }
    },
    notes: DataTypes.STRING,
    reportStatus: DataTypes.STRING,
    EmployeeId: getAssociationValidation('Employee', DataTypes)
  }, {
    sequelize,
    modelName: 'InternalTransaction',
  });

  InternalTransaction.beforeCreate((instance, options) => {
    instance.reportStatus = 'not reported';
  });

  return InternalTransaction;
};