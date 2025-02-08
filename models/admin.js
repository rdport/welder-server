'use strict';
const { hash } = require('../helpers/bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.Purchase);
      Admin.hasMany(models.Order);
      Admin.hasMany(models.Payment);
      Admin.hasMany(models.InternalTransaction);
      Admin.hasMany(models.GeneralTransaction);
      Admin.hasMany(models.Transaction);
      Admin.hasMany(models.Token);
      Admin.hasMany(models.AccountTransaction);
      Admin.hasMany(models.MaterialPurchase);
      Admin.hasMany(models.ProductMaterial);
      Admin.hasMany(models.ProductOrder);
      Admin.hasMany(models.StockEmployee);
    }
    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  };
  Admin.init({
    residentId: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'The resident ID has already been registered'
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'First name is required'
        },
        notEmpty: {
          args: true,
          msg: 'First name is required'
        }
      }
    },
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The email has already been registered'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Email is required'
        },
        notEmpty: {
          args: true,
          msg: 'Email is required'
        },
        isEmail: {
          args: true,
          msg: 'Email is invalid'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Password is required'
        },
        notEmpty: {
          args: true,
          msg: 'Password is required'
        },
        len: {
          args: [7, 128],
          msg: 'Password must contain at least 7 characters and maximum 128 characters'
        }
      }
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Class is required'
        },
        notEmpty: {
          args: true,
          msg: 'Class is required'
        },
        isIn: {
          args: [['standard', 'master']],
          msg: 'Class is invalid'
        }
      }
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }, {
    sequelize,
    modelName: 'Admin',
  });

  Admin.beforeCreate((instance, options) => {
    let hashed = hash(instance.password);
    instance.password = hashed;

    if (!instance.lastName.trim()) {
      instance.lastName = instance.firstName;
    }
  });

  return Admin;
};
