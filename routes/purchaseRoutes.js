const route = require('express').Router();
const PurchaseController = require('../controllers/PurchaseController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Purchase'), PurchaseController.showAll);
route.post('/register', PurchaseController.register);
route.post('/:id', PurchaseController.findByPk);
route.put('/:id', PurchaseController.edit);
route.delete('/:id', PurchaseController.delete);

module.exports = route;