'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.Admin);
    }
  };
  Token.init({
    accessToken: DataTypes.TEXT,
    refreshToken: DataTypes.TEXT,
    refreshTokenExpiredAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};