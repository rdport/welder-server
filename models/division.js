'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Division extends Model {
    static associate(models) {
      Division.hasMany(models.Purchase);
    }
  };
  Division.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The name has already been registered'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Name is required'
        },
        notEmpty: {
          args: true,
          msg: 'Name is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Division',
  });
  return Division;
};