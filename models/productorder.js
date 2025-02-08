'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrder extends Model {
    static associate(models) {
      ProductOrder.belongsTo(models.Product);
      ProductOrder.belongsTo(models.Order);
      ProductOrder.belongsTo(models.Admin);
      ProductOrder.hasMany(models.ProductMaterial);
      ProductOrder.hasMany(models.Assignment);
      
    }
  };
  ProductOrder.init({
    surveyDate: {
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
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
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
    area: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Area is required'
        },
        isNumeric: {
          args: true,
          msg: 'Area must be numeric'
        },
        isPositive(value) {
          if (value <= 0) {
            throw new Error("Area must be greater than 0");
          }
        }
      }
    },
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
    materialCost: DataTypes.DECIMAL(10 ,2),
    laborCost: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Labor cost is required'
        },
        isNumeric: {
          args: true,
          msg: 'Labor cost must be numeric'
        },
        min: {
          args: [0],
          msg: 'Labor cost must be at least 0'
        }
      }
    },
    electricityCost: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Electricity cost is required'
        },
        isNumeric: {
          args: true,
          msg: 'Electricity cost must be numeric'
        },
        min: {
          args: [0],
          msg: 'Electricity cost must be at least 0'
        }
      }
    },
    otherCost: {
      type: DataTypes.DECIMAL(10 ,2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Other cost is required'
        },
        isNumeric: {
          args: true,
          msg: 'Other cost must be numeric'
        },
        min: {
          args: [0],
          msg: 'Other cost must be at least 0'
        }
      }
    },
    commissionRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Commission rate is required'
        },
        isNumeric: {
          args: true,
          msg: 'Commission rate must be numeric'
        },
        min: {
          args: [0],
          msg: 'Commission rate must be at least 0'
        }
      }
    },
    productionStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Production status is required'
        },
        notEmpty: {
          args: true,
          msg: 'Production status is required'
        }
      }
    },
    orderIndex: DataTypes.INTEGER,
    ProductId: getAssociationValidation('Product', DataTypes),
    OrderId: getAssociationValidation('Order Id', DataTypes)
  }, {
    sequelize,
    modelName: 'ProductOrder',
  });

  ProductOrder.beforeCreate((instance, options) => {
    instance.materialCost = 0.00;
  });

  return ProductOrder;
};