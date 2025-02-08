const { Payment, Order, Reference, Admin, Customer, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  generateRefCode, chainOrderUpdate, findByPk, refCheckEdit, chainRefDelete, error404
} = require('../helpers/controllerHelpers');

class PaymentController {
  static async register(req, res, next) {
    try {
      let data;
      let referenceCode;
      await sequelize.transaction(async (t) => {
        const date = req.body.date;
        const OrderId = formatNumberInput(req.body.OrderId);
        const reference = await generateRefCode('payment', date, t);
        const ReferenceId = reference.id;
        referenceCode = reference.code;
        const newPayment = {
          title: req.body.title,
          date,
          paymentValue: formatNumberInput(req.body.paymentValue),
          notes: req.body.notes,
          OrderId,
          ReferenceId,
          AdminId: req.loggedInUser.id
        }
        data = await Payment.create(newPayment, { transaction: t });
        const relatedId = data.id;
        await Reference.update({ relatedId }, {
          where: {
            id: ReferenceId
          },
          transaction: t
        });
        await chainOrderUpdate(OrderId, 'Payment', t);      
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
        data = await Payment.findByPk(id, { 
          attributes:  [
            'id', 'title', 'date', 'paymentValue',
            'notes', 'reportStatus', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Order,
              attributes: ['id'],
              include: [
                {
                  model: Customer,
                  attributes: ['id', 'firstName', 'lastName']
                },
                {
                  model: Reference,
                  attributes: ['id', 'code']
                }
              ]
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
          throw error404('Payment');
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
        const id = +req.params.id;
        const OrderId = formatNumberInput(req.body.OrderId);
        const { paymentValue: prevPaymentValue } = await findByPk(Payment, id, ['paymentValue'], t);
        const currentPaymentValue = formatNumberInput(req.body.paymentValue);
        const updatedObj= {
          title: req.body.title,
          paymentValue: currentPaymentValue,
          notes: req.body.notes,
          reportStatus: req.body.reportStatus,
          OrderId,
          AdminId: req.loggedInUser.id
        };
        const results = await refCheckEdit(req, Payment, updatedObj, t);
        editedData = results.editedData;
        referenceCode = results.referenceCode;
        if (prevPaymentValue !== currentPaymentValue) {
          await chainOrderUpdate(OrderId, 'Payment', t);  
        }
      });
      res.status(200).json({ id: editedData.id, referenceCode });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const payment = await findByPk(Payment, id, ['OrderId'], t);
        const OrderId = payment.OrderId;
        await chainRefDelete(req, Payment, t);
        await chainOrderUpdate(OrderId, 'Payment', t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
