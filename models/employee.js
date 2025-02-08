'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.Assignment);
      Employee.hasMany(models.InternalTransaction);
      Employee.hasMany(models.StockEmployee);
    }
    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  };
  Employee.init({
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
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Position is required'
        },
        notEmpty: {
          args: true,
          msg: 'Position is required'
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
    modelName: 'Employee',
  });

  Employee.beforeCreate((instance, options) => {
    if (!instance.lastName.trim()) {
      instance.lastName = instance.firstName;
    }
  });

  return Employee;
};