const { Shopping, ProductMaterial, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class ShoppingController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        let date = null;
        if (req.body.date.trim()) {
          date = req.body.date;
        }
        const newShopping = {
          title: req.body.title,
          date,
          notes: req.body.notes
        };
        data = await Shopping.create(newShopping, { transaction: t});
      });
      res.status(201).json({ id: data.id, title: data.title });
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
        data = await Shopping.findByPk(id, { transaction: t});
        if (!data) {
          throw error404('Shopping');
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
        let date = null;
        if (req.body.date.trim()) {
          date = req.body.date;
        }
        const updatedShopping = {
          title: req.body.title,
          date,
          notes: req.body.notes
        };
        const data = await Shopping.update(updatedShopping, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Shopping');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, title: editedData.title });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const updatedProductMaterial = {
          ShoppingId: 1
        }
        await ProductMaterial.update(updatedProductMaterial, {
          where: {
            ShoppingId: id
          },
          transaction: t
        });
        const data = await Shopping.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Shopping');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) { 
      next(err);
    }
  }
}

module.exports = ShoppingController;
