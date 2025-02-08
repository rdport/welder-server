'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneralTransaction extends Model {
    static associate(models) {
      GeneralTransaction.belongsTo(models.Datebook);
      GeneralTransaction.belongsTo(models.Reference);
      GeneralTransaction.belongsTo(models.Admin);
    }
  };
  GeneralTransaction.init({
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
    orderIndex: DataTypes.INTEGER,
    DatebookId: getAssociationValidation('Datebook Id', DataTypes)
  }, {
    sequelize,
    modelName: 'GeneralTransaction',
  });

  GeneralTransaction.beforeCreate((instance, options) => {
    instance.reportStatus = 'not reported';
  });

  return GeneralTransaction;
};