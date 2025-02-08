'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Order);
    }
    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  };
  Customer.init({
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
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });

  Customer.beforeCreate((instance, options) => {
    if (!instance.lastName.trim()) {
      instance.lastName = instance.firstName;
    }
  });

  return Customer;
};