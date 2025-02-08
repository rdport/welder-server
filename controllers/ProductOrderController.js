const { ProductOrder, Product, Order, Customer, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  chainOrderUpdate, findByPk, patchProperty, changeOrderIndex, error404
} = require('../helpers/controllerHelpers');

class ProductOrderController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const OrderId = formatNumberInput(req.body.OrderId);
        let startDate = null;
        let endDate = null;
        if (req.body.startDate.trim()) {
          startDate = req.body.startDate;
        }
        if (req.body.endDate.trim()) {
          endDate = req.body.endDate;
        }
        const newProductOrder = {
          surveyDate: req.body.surveyDate,
          startDate,
          endDate,
          quantity: formatNumberInput(req.body.quantity),
          area: formatNumberInput(req.body.area),
          unitPrice: formatNumberInput(req.body.unitPrice),
          laborCost: formatNumberInput(req.body.laborCost),
          electricityCost: formatNumberInput(req.body.electricityCost),
          otherCost: formatNumberInput(req.body.otherCost),
          commissionRate: formatNumberInput(req.body.commissionRate),
          productionStatus: req.body.productionStatus,
          ProductId: formatNumberInput(req.body.ProductId),
          OrderId,
          AdminId: req.loggedInUser.id
        }
        data = await ProductOrder.create(newProductOrder, { transaction: t });
        await chainOrderUpdate(
          OrderId, 'ProductOrder', ['orderValue', 'confirmedOrderValue', 'productionCost'], t
        );
        await patchProperty({ orderIndex: data.id }, data.id, ProductOrder, t);
      });
      res.status(201).json({ id: data.id, ProductId: data.ProductId });
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
        data = await ProductOrder.findByPk(id, {
          attributes: [
            'id', 'surveyDate', 'startDate', 'endDate', 'quantity',
            'area', 'unitPrice', 'materialCost', 'laborCost', 'electricityCost',
            'otherCost', 'commissionRate', 'productionStatus', 'orderIndex', 'createdAt',
            'updatedAt'
          ],
          include: [
            {
              model: Order,
              attributes: ['id'],
              include: [
                {
                  model: Customer,
                  attributes: ['id', 'firstName', 'lastName']
                }
              ]
            },
            {
              model: Product,
              attributes: ['id', 'name']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            },
          ],
          transaction: t
        });
        if (!data) {
          throw error404('ProductOrder');
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
        const OrderId = formatNumberInput(req.body.OrderId);
        let startDate = null;
        let endDate = null;
        if (req.body.startDate.trim()) {
          startDate = req.body.startDate;
        }
        if (req.body.endDate.trim()) {
          endDate = req.body.endDate;
        }
        const unitPrice = formatNumberInput(req.body.unitPrice);
        const area = formatNumberInput(req.body.area);
        const quantity = formatNumberInput(req.body.quantity);
        const materialCost = formatNumberInput(req.body.materialCost);
        const laborCost = formatNumberInput(req.body.laborCost);
        const electricityCost = formatNumberInput(req.body.electricityCost);
        const otherCost = formatNumberInput(req.body.otherCost);
        const productionStatus = req.body.productionStatus;
        const {
          unitPrice: prevUnitPrice,
          area: prevArea,
          quantity: prevQuantity,
          materialCost: prevMaterialCost,
          laborCost: prevLaborCost,
          electricityCost: prevElectricityCost,
          otherCost: prevOtherCost,
          productionStatus: prevProductionStatus
        } = await findByPk(
          ProductOrder,
          id,
          [
            'unitPrice', 'area', 'quantity', 'materialCost',
            'laborCost', 'electricityCost', 'otherCost'
          ],
          t
        );
        const prevOrderValue = prevUnitPrice * prevArea * prevQuantity;
        const currentOrderValue = unitPrice * area * quantity;
        const prevProductionCost = 
          (prevMaterialCost + prevLaborCost + prevElectricityCost + prevOtherCost) * prevQuantity;
        const currentProductionCost = 
          (materialCost + laborCost + electricityCost + otherCost) * quantity;
        const updatedProductOrder = {
          surveyDate: req.body.surveyDate,
          startDate,
          endDate,
          quantity,
          area,
          unitPrice,
          materialCost,
          laborCost,
          electricityCost,
          otherCost,
          commissionRate: formatNumberInput(req.body.commissionRate),
          productionStatus: req.body.productionStatus,
          ProductId: formatNumberInput(req.body.ProductId),
          OrderId,
          orderIndex: formatNumberInput(req.body.orderIndex),
          AdminId: req.loggedInUser.id
        }
        const data = await ProductOrder.update(updatedProductOrder, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        const propertyArr = [];
        if (prevOrderValue !== currentOrderValue) {
          propertyArr.push('orderValue');
        }
        if (prevProductionStatus !== productionStatus) {
          propertyArr.push('confirmedOrderValue');
        }
        if (prevProductionCost !== currentProductionCost) {
          propertyArr.push('productionCost');
        }
        if (propertyArr.length) {
          await chainOrderUpdate(OrderId, 'ProductOrder', propertyArr, t);
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, ProductId: editedData.ProductId });
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
          idname: 'OrderId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, ProductOrder, t);
      });
      res.status(200).json({ id: patchedData.id, ProductId: patchedData.ProductId });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const productOrder = await findByPk(ProductOrder, id, ['OrderId'], t);
        const OrderId = productOrder.OrderId;
        await ProductOrder.destroy({
          where: {
            id
          },
          transaction: t
        });
        await chainOrderUpdate(
          OrderId, 'ProductOrder', ['orderValue', 'confirmedOrderValue', 'productionCost'], t
        );
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductOrderController;
