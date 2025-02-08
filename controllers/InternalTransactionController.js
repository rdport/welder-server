const { InternalTransaction, Employee, Reference, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  generateRefCode, refCheckEdit, chainRefDelete, error404
} = require('../helpers/controllerHelpers');

class InternalTransactionController {
  static async register(req, res, next) {
    try {
      let data;
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const date = req.body.date;
        const reference = await generateRefCode('internal-transaction', date, t);
        const ReferenceId = reference.id;
        referenceCode = reference.code;
        const newTransaction = {
          title: req.body.title,
          date,
          value: formatNumberInput(req.body.value),
          notes: req.body.notes,
          reportStatus: req.body.reportStatus,
          ReferenceId,
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          AdminId: req.loggedInUser.id
        }
        data = await InternalTransaction.create(newTransaction, { transaction: t });
        const relatedId = data.id;
        await Reference.update({ relatedId }, {
          where: {
            id: ReferenceId
          },
          transaction: t
        });
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
        data = await InternalTransaction.findByPk(id, {
          attributes: [
            'id', 'title', 'date', 'value', 'notes',
            'reportStatus', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Employee,
              attributes: ['id', 'firstName', 'lastName'] 
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
          throw error404('InternalTransaction');
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
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          AdminId: req.loggedInUser.id
        };
        const results = await refCheckEdit(req, InternalTransaction, updatedObj, t);
        editedData = results.editedData;
        referenceCode = results.referenceCode;
      });
      res.status(200).json({ id: editedData.id, referenceCode });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        await chainRefDelete(req, InternalTransaction, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InternalTransactionController;
