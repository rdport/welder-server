const { Division, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class DivisionController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newDivision = {
          name: req.body.name
        }
        data = await Division.create(newDivision, { transaction: t });
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
        data = await Division.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Division');
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
        const updatedDivision = {
          name: req.body.name
        }
        const data = await Division.update(updatedDivision, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Division');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, name: editedData.name });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Division.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Division');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DivisionController;
