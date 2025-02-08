const { Employee, Assignment, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class EmployeeController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newEmployee = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          position: req.body.position
        }
        data = await Employee.create(newEmployee, { transaction: t });
      });
      res.status(201).json({ id: data.id, email: data.email });
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
        data = await Employee.findByPk(id, { transaction: t });
        if (!data) {
          throw error404('Employee');
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
        const updatedEmployee = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          position: req.body.position
        }
        const data = await Employee.update(updatedEmployee, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Employee');
        }
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, email: editedData.email });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        await Assignment.destroy({
          where: {
            EmployeeId: id
          },
          transaction: t
        });
        const data = await Employee.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Employee');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) { 
      next(err);
    }
  }
}

module.exports = EmployeeController;
