const { Token, sequelize } = require('../models');
const { error404 } = require('../helpers/controllerHelpers');

class TokenController {
  static showAll(req, res, next) {
    res.status(200).json(res.results);
  }
  
  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const data = await Token.destroy({
          where: {
            id
          },
          transaction: t
        });
        if (!data) {
          throw error404('Token');
        }
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TokenController;