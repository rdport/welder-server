'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrandCategory extends Model {
    static associate(models) {
      BrandCategory.hasMany(models.Brand);
      BrandCategory.hasMany(models.Material);
    }
  };
  BrandCategory.init({
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BrandCategory',
  });
  return BrandCategory;
};