const { Brand, BrandCategory, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { patchProperty, changeOrderIndex, error404 } = require('../helpers/controllerHelpers');

class BrandController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newBrand = {
          name: req.body.name,
          BrandCategoryId: formatNumberInput(req.body.BrandCategoryId)
        };
        data = await Brand.create(newBrand, { transaction: t });
        await patchProperty({ orderIndex: data.id }, data.id, Brand, t);
      });
      res.status(201).json({ id: data.id, name: data.name });
    } catch (err) {
      next(err);
    }
  }

  static showAll(req, res, next) {
    res.status(200).json(res.results);
  }
  
  static showOptions(req, res, next) {
    res.status(200).json(res.results);
  }

  static async findByPk(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        data = await Brand.findByPk(id, {
          attributes: ['id', 'name', 'orderIndex', 'createdAt', 'updatedAt'],
          include: [
            {
              model: BrandCategory,
              attributes: ['id', 'category']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Brand');
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
        const updatedBrand = {
          name: req.body.name,
          BrandCategoryId: formatNumberInput(req.body.BrandCategoryId),
          orderIndex: formatNumberInput(req.body.orderIndex)
        };
        const data = await Brand.update(updatedBrand, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Brand');
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
          destinationIndex: formatNumberInput(req.body.destinationIndex),
          idname: 'BrandCategoryId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, Brand, t);
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
        const data = await Brand.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Brand');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BrandController;
