const { Customer, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class CustomerController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) =>{
        const newCustomer = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email
        };
        data = await Customer.create(newCustomer, { transaction: t });
      });
      res.status(201).json({ id: data.id, email: data.email });
    } catch (err) {
      next(err);
    }
  }

  static showAll(req, res, next) {
    res.status(200).json(res.results);
  }

  static async findByPk(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        data = await Customer.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Customer');
        }
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async edit(req, res, next) {
    try {
      let editedData;
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        const updatedCustomer = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email
        }
        const data = await Customer.update(updatedCustomer, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Customer');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, email: editedData.email });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        const data = await Customer.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Customer');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CustomerController;
