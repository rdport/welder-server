const route = require('express').Router();
const ProductOrderController = require('../controllers/ProductOrderController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('ProductOrder'), ProductOrderController.showAll);
route.post('/register', ProductOrderController.register);
route.post('/:id', ProductOrderController.findByPk);
route.put('/:id', ProductOrderController.edit);
route.patch('/:id', ProductOrderController.rearrange);
route.delete('/:id', ProductOrderController.delete);

module.exports = route;