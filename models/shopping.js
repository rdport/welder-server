'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shopping extends Model {
    static associate(models) {
      Shopping.hasMany(models.ProductMaterial);
    }
  };
  Shopping.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The title has already been registered'
      },
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
    date: DataTypes.DATEONLY,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shopping',
    tableName: 'Shoppings'
  });
  return Shopping;
};