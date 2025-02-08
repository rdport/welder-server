const { Datebook, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class DatebookController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newDatebook = {
          date: req.body.date
        }
        data = await Datebook.create(newDatebook, { transaction: t });
      });
      res.status(201).json({ id: data.id, date: data.date });
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
        data = await Datebook.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Datebook');
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
        const updatedDatebook = {
          date: req.body.date
        }
        const data = await Datebook.update(updatedDatebook, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Datebook');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, date: editedData.date });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Datebook.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Datebook');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DatebookController;
