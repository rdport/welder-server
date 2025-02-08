const route = require('express').Router();
const PaymentController = require('../controllers/PaymentController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Payment'), PaymentController.showAll);
route.post('/register', PaymentController.register);
route.post('/:id', PaymentController.findByPk);
route.put('/:id', PaymentController.edit);
route.delete('/:id', PaymentController.delete);

module.exports = route;