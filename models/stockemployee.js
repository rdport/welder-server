'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockEmployee extends Model {
    static associate(models) {
      StockEmployee.belongsTo(models.Stock);
      StockEmployee.belongsTo(models.Employee);
      StockEmployee.belongsTo(models.Admin);
    }
  };
  StockEmployee.init({
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Quantity is required'
        },
        isNumeric: {
          args: true,
          msg: 'Quantity must be numeric'
        },
        min: {
          args: [0],
          msg: 'Quantity must be at least 1'
        }
      }
    },
    notes: DataTypes.STRING,
    StockId: getAssociationValidation('Stock Id', DataTypes),
    EmployeeId: getAssociationValidation('Employee', DataTypes)
  }, {
    sequelize,
    modelName: 'StockEmployee',
  });
  return StockEmployee;
};