'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductMaterial extends Model {
    static associate(models) {
      ProductMaterial.belongsTo(models.Shopping);
      ProductMaterial.belongsTo(models.ProductOrder);
      ProductMaterial.belongsTo(models.Material);
      ProductMaterial.belongsTo(models.Brand);
      ProductMaterial.belongsTo(models.Admin);
    }
  };
  ProductMaterial.init({
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
    unitCost: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Unit cost is required'
        },
        isNumeric: {
          args: true,
          msg: 'Unit cost must be numeric'
        },
        min: {
          args: [0],
          msg: 'Unit cost must be at least 0'
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
    ProductOrderId: getAssociationValidation('Product order Id', DataTypes),
    // ShoppingId: getAssociationValidation('Shopping Id', DataTypes)
    ShoppingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductMaterial',
  });

  ProductMaterial.beforeCreate((instance, options) => {
    instance.ShoppingId = 1;
  });

  return ProductMaterial;
};