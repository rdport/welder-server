const route = require('express').Router();
const GeneralTransactionController = require('../controllers/GeneralTransactionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('GeneralTransaction'), GeneralTransactionController.showAll);
route.post('/register', GeneralTransactionController.register);
route.post('/:id', GeneralTransactionController.findByPk);
route.put('/:id', GeneralTransactionController.edit);
route.patch('/:id', GeneralTransactionController.rearrange);
route.delete('/:id/', GeneralTransactionController.delete);

module.exports = route;