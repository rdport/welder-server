const { Size, SizeCategory, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { patchProperty, changeOrderIndex, error404 } = require('../helpers/controllerHelpers');

class SizeController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newSize = {
          measurement: req.body.measurement,
          SizeCategoryId: formatNumberInput(req.body.SizeCategoryId)
        };
        data = await Size.create(newSize, { transaction: t });
        await patchProperty({ orderIndex: data.id }, data.id, Size, t);
      });
      res.status(201).json({ id: data.id, measurement: data.measurement });
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
        data = await Size.findByPk(id, {
          attributes: ['id', 'measurement', 'orderIndex', 'createdAt', 'updatedAt'],
          include: [
            {
              model: SizeCategory,
              attributes: ['id', 'category']
            }
          ],
          transaction: t });
        if (!data) {
          throw error404('Size');
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
        const updatedSize = {
          measurement: req.body.measurement,
          SizeCategoryId: formatNumberInput(req.body.SizeCategoryId),
          orderIndex: formatNumberInput(req.body.orderIndex)
        };
        const data = await Size.update(updatedSize, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Size');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, measurement: editedData.measurement });
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
          idname: 'SizeCategoryId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, Size, t);
      });
      res.status(200).json({ id: patchedData.id, measurement: patchedData.measurement });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Size.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Size');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SizeController;
