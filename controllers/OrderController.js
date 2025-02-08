const { Order, Customer, Reference, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  generateRefCode, refCheckEdit, chainRefDelete, error404
} = require('../helpers/controllerHelpers');

class OrderController {
  static async register(req, res, next) {
    try {
      let data;
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const date = req.body.date;
        const reference = await generateRefCode('order', date, t);
        const ReferenceId = reference.id;
        referenceCode = reference.code;
        const newOrder = {
          date,
          address: req.body.address,
          lat: formatNumberInput(req.body.lat),
          lon: formatNumberInput(req.body.lon),
          paymentType: req.body.paymentType,
          notes: req.body.notes,
          CustomerId: formatNumberInput(req.body.CustomerId),
          ReferenceId,
          AdminId: req.loggedInUser.id
        };
        data = await Order.create(newOrder, { transaction: t });
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
        data = await Order.findByPk(id, {
          attributes: [
            'id', 'date', 'address', 'lat', 'lon',
            'orderValue', 'confirmedOrderValue', 'productionCost', 'receivedPayment',
            'projectStatus', 'paymentType', 'paymentStatus', 'notes', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Customer,
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Reference,
              attributes: ['id', 'code']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Order');
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
          address: req.body.address,
          lat: formatNumberInput(req.body.lat),
          lon: formatNumberInput(req.body.lon),
          orderValue: formatNumberInput(req.body.orderValue),
          confirmedOrderValue: formatNumberInput(req.body.confirmedOrderValue),
          productionCost: formatNumberInput(req.body.productionCost),
          receivedPayment: formatNumberInput(req.body.receivedPayment),
          projectStatus: req.body.projectStatus,
          paymentType: req.body.paymentType,
          paymentStatus: req.body.paymentStatus,
          notes: req.body.notes,
          CustomerId: formatNumberInput(req.body.CustomerId),
          AdminId: req.loggedInUser.id
        };
        const results = await refCheckEdit(req, Order, updatedObj, t);
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
        await chainRefDelete(req, Order, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
