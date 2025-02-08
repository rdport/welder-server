'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Datebook extends Model {
    static associate(models) {
      Datebook.hasMany(models.GeneralTransaction);
    }
  };
  Datebook.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The date has already been registered'
      },
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
    }
  }, {
    sequelize,
    modelName: 'Datebook',
  });
  return Datebook;
};