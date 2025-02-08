const route = require('express').Router();
const AccountTransactionController = require('../controllers/AccountTransactionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('AccountTransaction'), AccountTransactionController.showAll);
route.post('/register', AccountTransactionController.register);
route.post('/:id', AccountTransactionController.findByPk);
route.put('/:id', AccountTransactionController.edit);
route.patch('/:id', AccountTransactionController.rearrange);
route.delete('/:id', AccountTransactionController.delete);

module.exports = route;