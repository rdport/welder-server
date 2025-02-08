'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountTransaction extends Model {
    static associate(models) {
      AccountTransaction.belongsTo(models.Account);
      AccountTransaction.belongsTo(models.Transaction);
      AccountTransaction.belongsTo(models.Admin);
    }
  };
  AccountTransaction.init({
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
    entry: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Entry is required'
        },
        notEmpty: {
          args: true,
          msg: 'Entry is required'
        },
        isIn: {
          args: [['debit', 'credit']],
          msg: 'Entry is invalid'
        }
      }
    },
    orderIndex: DataTypes.INTEGER,
    AccountId: getAssociationValidation('Account', DataTypes),
    TransactionId: getAssociationValidation('Transaction Id', DataTypes)
  }, {
    sequelize,
    modelName: 'AccountTransaction',
  });
  return AccountTransaction;
};