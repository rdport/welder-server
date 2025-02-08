const route = require('express').Router();
const StockController = require('../controllers/StockController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Stock'), StockController.showAll);
route.post('/register', StockController.register);
route.post('/:id', StockController.findByPk);
route.put('/:id', StockController.edit);
route.delete('/:id', StockController.delete);

module.exports = route;