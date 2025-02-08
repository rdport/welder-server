const { Transaction, Reference, Admin, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class TransactionController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newTransaction = {
          title: req.body.title,
          date: req.body.date,
          ReferenceId: +req.body.ReferenceId,
          AdminId: req.loggedInUser.id
        }
        data = await Transaction.create(newTransaction, { transaction: t });
      });
      res.status(201).json({ id: data.id, title: data.title });
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
        data = await Transaction.findByPk(id, {
          attributes: ['id', 'title', 'date', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Reference,
              attributes: ['id', 'code', 'category', 'relatedId']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Transaction');
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
        const updatedTransaction = {
          title: req.body.title,
          date: req.body.date,
          ReferenceId: +req.body.ReferenceId,
          AdminId: req.loggedInUser.id
        }
        const data = await Transaction.update(updatedTransaction, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Transaction');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, title: editedData.title });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Transaction.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Transaction');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) { 
      next(err);
    }
  }
}

module.exports = TransactionController;
