const { Product, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { patchProperty, changeOrderIndex, error404 } = require('../helpers/controllerHelpers');

class ProductController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newProduct = {
          name: req.body.name,
          description: req.body.description
        };
        data =  await Product.create(newProduct, { transaction: t });
        await patchProperty({ orderIndex: data.id }, data.id, Product, t);
      });
      res.status(201).json({ id: data.id, name: data.name });
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
        data = await Product.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Product');
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
        const updatedProduct = {
          name: req.body.name,
          description: req.body.description,
          orderIndex: formatNumberInput(req.body.orderIndex)
        };
        const data = await Product.update(updatedProduct, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Product');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, name: editedData.name });
    } catch (err) {
      next(err);
    }
  }

  static async rearrange(req, res, next) {
    try {
      let patchedData;
      await sequelize.transaction(async (t) => {
        const dataObj = {
          pk: +req.params.id,
          sourceIndex: formatNumberInput(req.body.sourceIndex),
          destinationIndex: formatNumberInput(req.body.destinationIndex)
        }
        patchedData = await changeOrderIndex(dataObj, Product, t);
      });
      res.status(200).json({ id: patchedData.id, name: patchedData.name });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Product.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Product');
        }
      });
      res.status(200).json({ message: 'Deleted from database' }); 
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
