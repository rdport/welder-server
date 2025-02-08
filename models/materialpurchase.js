'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MaterialPurchase extends Model {
    static associate(models) {
      MaterialPurchase.belongsTo(models.Material);
      MaterialPurchase.belongsTo(models.Brand);
      MaterialPurchase.belongsTo(models.Purchase);
      MaterialPurchase.belongsTo(models.Stock);
      MaterialPurchase.belongsTo(models.Admin);
    }
  };
  MaterialPurchase.init({
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
    correctedSize: DataTypes.STRING,
    thickness: DataTypes.STRING,
    correctedThickness: DataTypes.STRING,
    unitPrice: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Unit price is required'
        },
        isNumeric: {
          args: true,
          msg: 'Unit price must be numeric'
        },
        min: {
          args: [0],
          msg: 'Unit price must be at least 0'
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
          args: [1],
          msg: 'Quantity must be at least 1'
        }
      }
    },
    orderIndex: DataTypes.INTEGER,
    MaterialId: getAssociationValidation('Material', DataTypes),
    BrandId: getAssociationValidation('Brand', DataTypes),
    PurchaseId: getAssociationValidation('Purchase Id', DataTypes)
  }, {
    sequelize,
    modelName: 'MaterialPurchase',
  });
  return MaterialPurchase;
};