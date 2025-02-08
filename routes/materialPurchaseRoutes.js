const route = require('express').Router();
const MaterialPurchaseController = require('../controllers/MaterialPurchaseController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('MaterialPurchase'), MaterialPurchaseController.showAll);
route.post('/register', MaterialPurchaseController.register);
route.post('/:id', MaterialPurchaseController.findByPk);
route.put('/:id', MaterialPurchaseController.edit);
route.patch('/:id',  MaterialPurchaseController.rearrange);
route.delete('/:id', MaterialPurchaseController.delete);

module.exports = route;