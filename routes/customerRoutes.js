const route = require('express').Router();
const CustomerController = require('../controllers/CustomerController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Customer'), CustomerController.showAll);
route.post('/register', CustomerController.register);
route.post('/:id', CustomerController.findByPk);
route.put('/:id', CustomerController.edit);
route.delete('/:id', CustomerController.delete);

module.exports = route;