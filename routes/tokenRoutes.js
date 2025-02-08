const route = require('express').Router();
const TokenController = require('../controllers/TokenController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.use(authorization);
route.post('/', resultFilterPaginator('Token'), TokenController.showAll);
route.delete('/:id', TokenController.delete);

module.exports = route;