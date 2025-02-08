const { Admin, Token, sequelize, Sequelize } = require('../models');
const Op = Sequelize.Op;
const { compare } = require('../helpers/bcrypt');
const { sign, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt');
const { error404 } = require('../helpers/controllerHelpers');
const getExpiredAt = require('../helpers/getExpiredAt');

class AdminController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const newAdmin = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          class: req.body.class
        }
        data = await Admin.create(newAdmin, { transaction: t });
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
        data = await Admin.findByPk(id, {
          attributes: [
            'id', 'residentId', 'firstName', 'lastName', 'address',
            'phone', 'email', 'class', 'createdAt', 'updatedAt'
          ],
          transaction: t
        });
        if (!data) {
          throw error404('Admin');
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
        const updatedAdmin = {
          residentId: req.body.residentId.trim() || null,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          password: req.body.password,
          class: req.body.class
        }
        const data = await Admin.update(updatedAdmin, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (!data[0]) {
          throw error404('Admin');
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
        const data = await Admin.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Admin');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      let data;
      let accessToken;
      let refreshToken;
      await sequelize.transaction(async (t) => {
        data = await Admin.findOne({
          where: {
            email: req.body.email,
          },
          transaction: t
        });
        if (!data) {
          throw {
            status: 401,
            message: 'The email or password is incorrect'
          }
        } else if (compare(req.body.password, data.password)) {
          accessToken = sign(data.id, data.email, data.class, data.fullName);
          refreshToken = signRefreshToken(data.id, data.email, data.class, data.fullName);
          const newToken = {
            accessToken,
            refreshToken,
            refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
            AdminId: data.id,
          };
          await Token.create(newToken, { transaction: t });
          await Token.destroy({
            where: {
              refreshTokenExpiredAt: { [Op.lte]: new Date() }
            },
            transaction: t
          });
        } else {
          throw {
            status: 401,
            message: 'The email or password is incorrect'
          }
        }
      });
      res.cookie('refreshToken', refreshToken, {
        MaxAge: +process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS,
        httpOnly: true,
        secure: false
      });
      res.status(200).json({
        accessToken, id: data.id, class: data.class, fullName: data.fullName
      });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      let accessToken;
      let newRefreshToken;
      let id;
      let adminClass;
      let fullName;
      await sequelize.transaction(async (t) => {
        const refreshToken = req.cookies['refreshToken'];
        if(!refreshToken) {
          throw {
            status: 401,
            message: 'Unauthorized Access!'
          }
        }
        const data = await Token.findOne({
          where: {
            refreshToken
          },
          transaction: t
        });
        if (!data) {
          throw {
            status: 401,
            message: 'Unauthorized Access!'
          }
        } else {
          const decoded = verifyRefreshToken(data.refreshToken);
          accessToken = sign(decoded.id, decoded.email, decoded.class, decoded.fullName);
          newRefreshToken = signRefreshToken(
            decoded.id, decoded.email, decoded.class, decoded.fullName
          );
          const newToken = {
            accessToken,
            refreshToken: newRefreshToken,
            refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
            AdminId: decoded.id,
          };
          await Token.create(newToken, { transaction: t });
          await Token.destroy({
            where: {
              [Op.or]: [{ id: data.id }, { refreshTokenExpiredAt: { [Op.lte]: new Date() } }]
            },
            transaction: t
          });
          id = decoded.id;
          adminClass = decoded.class;
          fullName = decoded.fullName;
        }
      });
      res.cookie('refreshToken', newRefreshToken, {
        MaxAge: +process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS,
        httpOnly: true,
        secure: false
      });
      res.status(200).json({ accessToken, id, class: adminClass, fullName });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const AdminId = +req.loggedInUser.id;
        const refreshToken = req.cookies['refreshToken'];
        await Token.destroy({
          where: {
            [Op.or]: [
              { [Op.and]: [{ refreshToken }, { AdminId }] },
              { refreshTokenExpiredAt: { [Op.lte]: new Date() } }
            ]
          },
          transaction: t
        });
      });
      res.cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: false
      });
      res.status(200).json({ message: 'You have been signed out' });
    } catch (err) {
      next(err);
    }
  }

  static async logoutAll(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const AdminId = +req.loggedInUser.id;
        await Token.destroy({
          where: {
            [Op.or]: [{ AdminId }, {  refreshTokenExpiredAt: { [Op.lte]: new Date() } }]
          },
          transaction: t
        });
      });
      res.cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: false
      });
      res.status(200).json({ message: 'You have been signed out on all devices' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
