'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.AccountTransaction);
    }
  };
  Account.init({
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The code has already been registered'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Code is required'
        },
        notEmpty: {
          args: true,
          msg: 'Code is required'
        }
      }
    },
    category: DataTypes.STRING,
    // category: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       args: true,
    //       msg: 'Category is required'
    //     },
    //     notEmpty: {
    //       args: true,
    //       msg: 'Category is required'
    //     },
    //     isIn: {
    //       args: [['Neraca', 'Laba Rugi']],
    //       msg: 'Category is invalid'
    //     }
    //   }
    // },
    normally: DataTypes.STRING,
    // normally: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       args: true,
    //       msg: 'Normally is required'
    //     },
    //     notEmpty: {
    //       args: true,
    //       msg: 'Normally is required'
    //     },
    //     isIn: {
    //       args: [['debit', 'kredit']],
    //       msg: 'Normally is invalid'
    //     }
    //   }
    // }
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};