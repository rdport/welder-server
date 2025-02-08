const { Material, SizeCategory, Size, BrandCategory, Brand, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { patchProperty, changeOrderIndex, error404 } = require('../helpers/controllerHelpers');

class MaterialController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newMaterial = {
          name: req.body.name,
          SizeCategoryId: formatNumberInput(req.body.SizeCategoryId),
          BrandCategoryId: formatNumberInput(req.body.SizeCategoryId)
        };
        data = await Material.create(newMaterial, { transaction: t });
        await patchProperty({ orderIndex: data.id }, data.id, Material, t);
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
        data = await Material.findByPk(id, {
          attributes: ['id', 'name', 'orderIndex', 'createdAt', 'updatedAt'],
          include: [
            {
              model: SizeCategory,
              attributes: ['id', 'category'],
              include: [
                {
                  model: Size,
                  attributes: ['id', 'measurement', 'orderIndex'],
                  order: [['orderIndex', 'ASC']]
                }
              ]
            },
            {
              model: BrandCategory,
              attributes: ['id', 'category'],
              include: [
                {
                  model: Brand,
                  attributes: ['id', 'name', 'orderIndex'],
                  order: [['orderIndex', 'ASC']]
                }
              ]
            }
          ],
          transaction: t });
        if (!data) {
          throw error404('Material');
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
        const updatedMaterial = {
          name: req.body.name,
          SizeCategoryId: formatNumberInput(req.body.SizeCategoryId),
          BrandCategoryId: formatNumberInput(req.body.SizeCategoryId),
          orderIndex: formatNumberInput(req.body.orderIndex)
        };
        const data = await Material.update(updatedMaterial, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Material');
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
        patchedData = await changeOrderIndex(dataObj, Material, t);
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
        const data = await Material.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Material');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MaterialController;
