const { Admin, Token } = require("../models");
const { verifyToken } = require("../helpers/jwt");

module.exports = async (req, res, next) => {
  try {
    const { access_token: accessToken } = req.headers;
    const data = await Token.findOne({
      attributes: ['id'],
      where: {
        accessToken
      }
    });
    if (!accessToken || !data) {
      throw {
        status: 401,
        message: "Unauthorized Access!"
      }
    } else {
      const decoded = verifyToken(accessToken);
      req.loggedInUser = decoded;
      const admin = await Admin.findOne({
        attributes: ['id'],
        where: {
          id: decoded.id
        }
      })

      if (admin) {
        next();
      } else {
        throw {
          status: 401,
          message: "Unauthorized Access!"
        }
      }
    }
  } catch (err) {
    next(err);
  }
}