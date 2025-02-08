const { Reference, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { error404 } = require('../helpers/controllerHelpers');

class ReferenceController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newReference = {
          code: req.body.code,
          category: req.body.category,
          date: req.body.date
        };
        data = await Reference.create(newReference, { transaction: t });
      });
      res.status(201).json({ id: data.id, code: data.code });
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
        data = await Reference.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Reference');
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
        const updatedReference = {
          code: req.body.code,
          category: req.body.category,
          date: req.body.date,
          relatedId: formatNumberInput(req.body.relatedId)
        };
        const data = await Reference.update(updatedReference, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Reference');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, code: editedData.code });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Reference.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Reference');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReferenceController;
