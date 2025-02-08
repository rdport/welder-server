const route = require('express').Router();
const OrderController = require('../controllers/OrderController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Order'), OrderController.showAll);
route.post('/register', OrderController.register);
route.post('/:id', OrderController.findByPk);
route.put('/:id', OrderController.edit);
route.delete('/:id/', OrderController.delete);

module.exports = route;