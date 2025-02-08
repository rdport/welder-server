const models = require('../models');
const { sequelize } = models;
const Op = models.Sequelize.Op;
const { findByPk } = require('../helpers/controllerHelpers');

function generateOptions(modelName) {
  return async (req, res, next) => {
    try {
      await sequelize.transaction(async (t) => {
        const queryObj = {};
        queryObj.where = {
          [Op.and]: []
        };
        queryObj.transaction = t;
        switch (modelName) {
          case 'Account':
            queryObj.attributes = ['id', 'name'];
            queryObj.order = [['code', 'ASC']];
            break;

          case 'Material':
            queryObj.attributes = ['id', 'name'];
            queryObj.order = [['name', 'ASC']];
            break;

          case 'Size':
            queryObj.attributes = ['id', 'measurement'];
            queryObj.order = [['orderIndex', 'ASC']];
            break;

          case 'Brand':
            queryObj.attributes = ['id', 'name'];
            queryObj.order = [['orderIndex', 'ASC']];
            break;
        }

        if (req.query.dependencyidname) {
          const dependencyidname = req.query.dependencyidname;
          const dependencyid = parseInt(req.query.dependencyid);
          const associationidname = req.query.associationidname;
          const modelFromIdname = dependencyidname.slice(0, dependencyidname.length - 2);
          const data = await findByPk(models[modelFromIdname], dependencyid, [associationidname], t);
          const associationid = data[associationidname];
          queryObj.where[Op.and].push({ [associationidname]: associationid });
        }

        const data = await models[modelName].findAll(queryObj);
        res.results = data;
        next();
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = generateOptions;

