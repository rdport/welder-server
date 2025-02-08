'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeCategory extends Model {
    static associate(models) {
      SizeCategory.hasMany(models.Material);
      SizeCategory.hasMany(models.Size);
    }
  };
  SizeCategory.init({
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The category has already been registered'
      },
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
    }
  }, {
    sequelize,
    modelName: 'SizeCategory',
  });
  return SizeCategory;
};