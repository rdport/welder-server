'use strict';
const getAssociationValidation = require ('../helpers/getAssociationValidation');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Employee);
      Assignment.belongsTo(models.ProductOrder);
    }
  };
  Assignment.init({
    notes: DataTypes.STRING,
    EmployeeId: getAssociationValidation('Employee', DataTypes),
    ProductOrderId: getAssociationValidation('Product order Id', DataTypes)
  }, {
    sequelize,
    modelName: 'Assignment',
  });
  return Assignment;
};