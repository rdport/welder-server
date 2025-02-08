'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.SizeCategory);
      Material.belongsTo(models.BrandCategory);
      Material.hasMany(models.MaterialPurchase);
      Material.hasMany(models.ProductMaterial);
      Material.hasMany(models.Stock);
    }
  };
  Material.init({
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
    },
    orderIndex: DataTypes.INTEGER,
    SizeCategoryId: getAssociationValidation('Size category', DataTypes),
    BrandCategoryId: getAssociationValidation('Brand category', DataTypes)
  }, {
    sequelize,
    modelName: 'Material',
  });
  return Material;
};