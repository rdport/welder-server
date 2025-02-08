const route = require('express').Router();
const ShoppingController = require('../controllers/ShoppingController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Shopping'), ShoppingController.showAll);
route.post('/register', ShoppingController.register);
route.post('/:id', ShoppingController.findByPk);
route.put('/:id', ShoppingController.edit);
route.delete('/:id', ShoppingController.delete);

module.exports = route;