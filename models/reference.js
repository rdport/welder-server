'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reference extends Model {
    static associate(models) {
      Reference.hasOne(models.Purchase);
      Reference.hasOne(models.Order);
      Reference.hasOne(models.Payment);
      Reference.hasOne(models.InternalTransaction);
      Reference.hasOne(models.GeneralTransaction);
      Reference.hasOne(models.Transaction);
    }
  };
  Reference.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The code has already been registered'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Code is required'
        },
        notEmpty: {
          args: true,
          msg: 'Code is required'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Category is required'
        },
        notEmpty: {
          args: true,
          msg: 'Category is required'
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
    relatedId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reference',
  });
  return Reference;
};