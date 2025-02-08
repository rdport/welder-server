const route = require('express').Router();
const SupplierController = require('../controllers/SupplierController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Supplier'), SupplierController.showAll);
route.post('/register', SupplierController.register);
route.post('/:id', SupplierController.findByPk);
route.put('/:id', SupplierController.edit);
route.delete('/:id', SupplierController.delete);

module.exports = route;