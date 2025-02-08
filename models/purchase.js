'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.belongsTo(models.Supplier);
      Purchase.belongsTo(models.Division);
      Purchase.belongsTo(models.Reference);
      Purchase.belongsTo(models.Admin);
      Purchase.hasMany(models.MaterialPurchase);
    }
  };
  Purchase.init({
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
    notes: DataTypes.STRING,
    purchaseValue: DataTypes.DECIMAL(10 ,2),
    paidAmount: DataTypes.DECIMAL(10 ,2),
    purchaseStatus: DataTypes.STRING,
    reportStatus: DataTypes.STRING,
    SupplierId: getAssociationValidation('Supplier Id', DataTypes),
    DivisionId: getAssociationValidation('Division', DataTypes)
  }, {
    sequelize,
    modelName: 'Purchase',
  });

  Purchase.beforeCreate((instance, options) => {
    instance.purchaseValue = 0.00;
    instance.paidAmount = 0.00;
    instance.purchaseStatus = 'unpaid';
    instance.reportStatus = 'not reported';
  });

  return Purchase;
};