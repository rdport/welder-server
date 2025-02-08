'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.belongsTo(models.BrandCategory);
      Brand.hasMany(models.MaterialPurchase);
      Brand.hasMany(models.ProductMaterial);
      Brand.hasMany(models.Stock);
    }
  };
  Brand.init({
    name: DataTypes.STRING,
    orderIndex: DataTypes.INTEGER,
    BrandCategoryId: getAssociationValidation('Brand category Id', DataTypes)
  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};