const { StockEmployee, Stock, Material, Employee, Admin, sequelize } = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const { findByPk, error404, patchProperty } = require('../helpers/controllerHelpers');

class StockEmployeeController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const StockId = formatNumberInput(req.body.StockId);
        const quantity = formatNumberInput(req.body.quantity);
        const stock = await findByPk(Stock, StockId, ['quantity'], t);
        const stockQuantity = stock.quantity;
        if (quantity > stockQuantity) {
          throw {
            status: 400,
            message: 'The quantity exceeds stock quantity'
          }
        }
        const newStockEmployee = {
          date: req.body.date,
          quantity,
          notes: req.body.notes,
          StockId,
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          AdminId: req.loggedInUser.id
        };
        data = await StockEmployee.create(newStockEmployee, { transaction: t });
        await patchProperty({ quantity: stockQuantity - quantity }, StockId, Stock, t);
      });
      res.status(201).json({ id: data.id, quantity: data.quantity });
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
        data = await StockEmployee.findByPk(id, {
          attributes: ['id', 'date', 'quantity', 'notes', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Stock,
              attributes: ['id', 'size', 'thickness'],
              include: [
                {
                  model: Material,
                  attributes: ['id', 'name']
                }
              ]
            },
            {
              model: Employee,
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t });
        if (!data) {
          throw error404('StockEmployee');
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
        const StockId = formatNumberInput(req.body.StockId);
        const quantity = formatNumberInput(req.body.quantity);
        const { quantity: prevQuantity } = await findByPk(StockEmployee, id, ['quantity'], t);
        const stock = await findByPk(Stock, StockId, ['quantity'], t);
        const stockQuantity = stock.quantity;
        if (quantity > stockQuantity + prevQuantity) {
          throw {
            status: 400,
            message: 'The quantity exceeds stock quantity'
          }
        }
        const updatedStockEmployee = {
          date: req.body.date,
          quantity,
          notes: req.body.notes,
          StockId,
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          AdminId: req.loggedInUser.id
        };
        const data = await StockEmployee.update(updatedStockEmployee, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        editedData = data[1][0];
        if (prevQuantity !== quantity) {
          await patchProperty(
            { quantity: stockQuantity + prevQuantity - quantity },
            StockId, Stock, t
          );
        }
      });
      res.status(200).json({ id: editedData.id, quantity: editedData.quantity });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const stockEmployee = await findByPk(StockEmployee, id, ['StockId', 'quantity'], t);
        const StockId = stockEmployee.StockId;
        const deletedQuantity = stockEmployee.quantity;
        const { quantity: stockQuantity } = await findByPk(Stock, StockId, ['quantity'], t);
        await StockEmployee.destroy({
          where: {
            id
          },
          transaction: t
        });
        await patchProperty({ quantity: stockQuantity + deletedQuantity }, StockId, Stock, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = StockEmployeeController;
