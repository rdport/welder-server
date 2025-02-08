const { Supplier, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class SupplierController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newSupplier = {
          name: req.body.name,
          address: req.body.address,
          city: req.body.city,
          phone: req.body.phone,
          email: req.body.email,
          notes: req.body.notes
        };
        data = await Supplier.create(newSupplier, { transaction: t });
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
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        data = await Supplier.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Supplier');
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
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const updatedSupplier = {
          name: req.body.name,
          address: req.body.address,
          city: req.body.city,
          phone: req.body.phone,
          email: req.body.email,
          notes: req.body.notes
        }
        const data = await Supplier.update(updatedSupplier, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Supplier');
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
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Supplier.destroy({
          where: {
            id
          }, 
          transaction: t
        });
        if (!data) {
          throw error404('Supplier');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SupplierController;
