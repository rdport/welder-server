'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.hasMany(models.MaterialPurchase);
      Stock.hasMany(models.StockEmployee);
      Stock.belongsTo(models.Material);
      Stock.belongsTo(models.Brand);
    }
  };
  Stock.init({
    size: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Size is required'
        },
        notEmpty: {
          args: true,
          msg: 'Size is required'
        }
      }
    },
    thickness: DataTypes.STRING,
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
          msg: 'Quantity must be at least 0'
        }
      }
    },
    notes: DataTypes.STRING,
    MaterialId: getAssociationValidation('Material', DataTypes),
    BrandId: getAssociationValidation('Brand', DataTypes)
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};