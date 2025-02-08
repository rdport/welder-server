const { Purchase, Supplier, Division, Reference, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  generateRefCode, refCheckEdit, chainRefDelete, error404
} = require('../helpers/controllerHelpers');

class PurchaseController {
  static async register(req, res, next) {
    try {
      let data;
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const date = req.body.date;
        const reference = await generateRefCode('purchase', date, t);
        const ReferenceId = reference.id;
        referenceCode = reference.code;
        const newPurchase = {
          date,
          notes: req.body.notes,
          SupplierId: formatNumberInput(req.body.SupplierId),
          DivisionId: formatNumberInput(req.body.DivisionId),
          ReferenceId,
          AdminId: req.loggedInUser.id
        };
        data = await Purchase.create(newPurchase, { transaction: t });
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
        data = await Purchase.findByPk(id, {
          attributes: [
            'id', 'date', 'notes', 'purchaseValue', 'paidAmount',
            'purchaseStatus', 'reportStatus', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Division,
              attributes: ['id', 'name'],
            },
            {
              model: Reference,
              attributes: ['id', 'code']
            },
            {
              model: Supplier,
              attributes: ['id', 'name', 'city']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Purchase');
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
          notes: req.body.notes,
          purchaseValue: formatNumberInput(req.body.purchaseValue),
          paidAmount: formatNumberInput(req.body.paidAmount),
          purchaseStatus: req.body.purchaseStatus,
          reportStatus: req.body.reportStatus,
          SupplierId: formatNumberInput(req.body.SupplierId),
          DivisionId: formatNumberInput(req.body.DivisionId),
          AdminId: req.loggedInUser.id
        };
        const results = await refCheckEdit(req, Purchase, updatedObj, t);
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
        await chainRefDelete(req, Purchase, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PurchaseController;
