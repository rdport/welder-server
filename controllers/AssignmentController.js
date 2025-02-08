const { Assignment, Employee, ProductOrder, Product, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');
const formatNumberInput = require('../helpers/formatNumberInput');

class AssignmentController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) =>{
        const newAssignment = {
          notes: req.body.notes,
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          ProductOrderId: formatNumberInput(req.body.ProductOrderId)
        };
        data = await Assignment.create(newAssignment, { transaction: t });
      });
      res.status(201).json({ id: data.id, EmployeeId: data.EmployeeId });
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
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        data = await Assignment.findByPk(id, {
          attributes: ['id', 'notes', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Employee,
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: ProductOrder,
              attributes: ['id'],
              include: [
                {
                  model: Product,
                  attributes: ['id', 'name']
                }
              ]
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Assignment');
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
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        const updatedAssignment = {
          notes: req.body.notes,
          EmployeeId: formatNumberInput(req.body.EmployeeId),
          ProductOrderId: formatNumberInput(req.body.ProductOrderId)
        };
        const data = await Assignment.update(updatedAssignment, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Assignment');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, EmployeeId: editedData.EmployeeId });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) =>{
        const id = +req.params.id;
        const data = await Assignment.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Assignment');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AssignmentController;
