const { Position, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class PositionController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newPosition = {
          name: req.body.name
        };
        data = await Position.create(newPosition, { transaction: t });
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
        data = await Position.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Position');
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
        const updatedPosition = {
          name: req.body.name
        };
        const data = await Position.update(updatedPosition, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Position');
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
        const data = await Position.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Position');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PositionController;
