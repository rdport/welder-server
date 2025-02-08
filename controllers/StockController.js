const { Stock, Material, Brand, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');
const formatNumberInput = require ('../helpers/formatNumberInput');

class StockController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newStock = {
          MaterialId: formatNumberInput(req.body.MaterialId),
          BrandId: formatNumberInput(req.body.BrandId),
          size: req.body.size,
          thickness: req.body.thickness,
          quantity: formatNumberInput(req.body.quantity),
          notes: req.body.notes
        };
        data = await Stock.create(newStock, { transaction: t });
      });
      res.status(201).json({ id: data.id, quantity: data.quantity });
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
        data = await Stock.findByPk(id, {
          attributes: ['id', 'size', 'thickness', 'quantity', 'notes', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Material,
              attributes: ['id', 'name']
            },
            {
              model: Brand,
              attributes: ['id', 'name']
            }
          ],
          transaction: t });
        if (!data) {
          throw error404('Stock');
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
        const updatedStock = {
          MaterialId: formatNumberInput(req.body.MaterialId),
          BrandId: formatNumberInput(req.body.BrandId),
          size: req.body.size,
          thickness: req.body.thickness,
          quantity: formatNumberInput(req.body.quantity),
          notes: req.body.notes
        };
        const data = await Stock.update(updatedStock, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Stock');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, quantity: editedData.quantity });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Stock.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Stock');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StockController;
