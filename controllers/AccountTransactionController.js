const {
  AccountTransaction, Account, Transaction,
  Reference, Admin, sequelize
} = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { patchProperty, changeOrderIndex, error404 } = require('../helpers/controllerHelpers');

class AccountTransactionController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newAccountTransaction = {
          value: formatNumberInput(req.body.value),
          entry: req.body.entry,
          AccountId: formatNumberInput(req.body.AccountId),
          TransactionId: formatNumberInput(req.body.TransactionId),
          AdminId: req.loggedInUser.id
        };
        data = await AccountTransaction.create(newAccountTransaction, { transaction: t });
        await patchProperty({ orderIndex: data.id }, data.id, AccountTransaction, t);
      });
      res.status(201).json({ id: data.id, AccountId: data.AccountId });
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
        data = await AccountTransaction.findByPk(id, {
          attributes: ['id', 'value', 'entry', 'orderIndex', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Account,
              attributes: ['id', 'name', 'code']
            },
            {
              model: Transaction,
              attributes: ['id', 'title', 'date'],
              include: [
                {
                  model: Reference,
                  attributes: ['id', 'code', 'category', 'relatedId'],
                }
              ]
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('AccountTransaction');
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
        const updatedAccountTransaction = {
          value: formatNumberInput(req.body.value),
          entry: req.body.entry,
          AccountId: formatNumberInput(req.body.AccountId),
          TransactionId: formatNumberInput(req.body.TransactionId),
          orderIndex: formatNumberInput(req.body.orderIndex),
          AdminId: req.loggedInUser.id
        };
        const data = await AccountTransaction.update(updatedAccountTransaction, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('AccountTransaction');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, AccountId: editedData.AccountId });
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
          idname: 'TransactionId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, AccountTransaction, t);
      });
      res.status(200).json({ id: patchedData.id, AccountId: patchedData.AccountId });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await AccountTransaction.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('AccountTransaction');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) { 
      next(err);
    }
  }
}

module.exports = AccountTransactionController;
