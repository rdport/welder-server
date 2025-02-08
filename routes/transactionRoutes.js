const route = require('express').Router();
const TransactionController = require('../controllers/TransactionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Transaction'), TransactionController.showAll);
route.post('/register', TransactionController.register);
route.post('/:id', TransactionController.findByPk);
route.put('/:id', TransactionController.edit);
route.delete('/:id', TransactionController.delete);

module.exports = route;