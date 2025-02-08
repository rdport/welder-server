'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.belongsTo(models.SizeCategory);
    }
  };
  Size.init({
    measurement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Measurement is required'
        },
        notEmpty: {
          args: true,
          msg: 'Measurement is required'
        }
      }
    },
    orderIndex: DataTypes.INTEGER,
    SizeCategoryId: getAssociationValidation('Size category', DataTypes)
  }, {
    sequelize,
    modelName: 'Size',
  });
  return Size;
};