const { GeneralTransaction, Datebook, Reference, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  generateRefCode, refCheckEdit, chainRefDelete, patchProperty, changeOrderIndex, error404
} = require('../helpers/controllerHelpers');

class GeneralTransactionController {
  static async register(req, res, next) {
    try {
      let data;
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const date = req.body.date;
        const reference = await generateRefCode('general-transaction', date, t);
        const ReferenceId = reference.id;
        referenceCode = reference.code;
        const newTransaction = {
          title: req.body.title,
          value: formatNumberInput(req.body.value),
          notes: req.body.notes,
          ReferenceId,
          DatebookId: formatNumberInput(req.body.DatebookId),
          AdminId: req.loggedInUser.id
        };
        data = await GeneralTransaction.create(newTransaction, { transaction: t });
        const relatedId = data.id;
        await Reference.update({ relatedId }, {
          where: {
            id: ReferenceId
          },
          transaction: t
        });
        await patchProperty({ orderIndex: data.id }, data.id, GeneralTransaction, t);
      });
      res.status(201).json({ id: data.id, referenceCode });
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
        data = await GeneralTransaction.findByPk(id, {
          attributes: [
            'id', 'title', 'value', 'notes',
            'reportStatus', 'orderIndex', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Datebook,
              attributes: ['id', 'date'] 
            },
            {
              model: Reference,
              attributes:['id', 'code']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('GeneralTransaction');
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
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const updatedObj= {
          title: req.body.title,
          value: formatNumberInput(req.body.value),
          notes: req.body.notes,
          reportStatus: req.body.reportStatus,
          DatebookId: formatNumberInput(req.body.DatebookId),
          orderIndex: formatNumberInput(req.body.orderIndex),
          AdminId: req.loggedInUser.id
        };
        const results = await refCheckEdit(req, GeneralTransaction, updatedObj, t);
        editedData = results.editedData;
        referenceCode = results.referenceCode;
      });
      res.status(200).json({ id: editedData.id, referenceCode });
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
          idname: 'DatebookId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, GeneralTransaction, t);
      });
      res.status(200).json({ id: patchedData.id, referenceCode: patchedData.referenceCode });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        await chainRefDelete(req, GeneralTransaction, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = GeneralTransactionController;
