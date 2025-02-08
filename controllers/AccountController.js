const { Account, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class AccountController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newAccount = {
          name: req.body.name,
          code: req.body.code,
          category: req.body.category,
          normally: req.body.normally
        };
        data = await Account.create(newAccount, { transaction: t });
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
        data = await Account.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Account');
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
        const updatedAccount = {
          name: req.body.name,
          code: req.body.code,
          category: req.body.category,
          normally: req.body.normally,
        }
        const data = await Account.update(updatedAccount, {
          where: { 
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Account');
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
        const data = await Account.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Account');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) { 
      next(err);
    }
  }
}

module.exports = AccountController;
