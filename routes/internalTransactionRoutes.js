const route = require('express').Router();
const InternalTransactionController = require('../controllers/InternalTransactionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('InternalTransaction'), InternalTransactionController.showAll);
route.post('/register', InternalTransactionController.register);
route.post('/:id', InternalTransactionController.findByPk);
route.put('/:id', InternalTransactionController.edit);
route.delete('/:id', InternalTransactionController.delete);

module.exports = route;