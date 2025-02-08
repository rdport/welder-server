const { SizeCategory, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class SizeCategoryController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newSizeCategory = {
          category: req.body.category
        };
        data = await SizeCategory.create(newSizeCategory, { transaction: t});
      });
      res.status(201).json({ id: data.id, category: data.category });
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
        data = await SizeCategory.findByPk(id, { transaction: t});
        if (!data) {
          throw error404('SizeCategory');
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
        const updatedSizeCategory = {
          category: req.body.category
        };
        const data = await SizeCategory.update(updatedSizeCategory, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('SizeCategory');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, category: editedData.category });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await SizeCategory.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('SizeCategory');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SizeCategoryController;
