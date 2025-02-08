const route = require('express').Router();
const StockEmployeeController = require('../controllers/StockEmployeeController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('StockEmployee'), StockEmployeeController.showAll);
route.post('/register', StockEmployeeController.register);
route.post('/:id', StockEmployeeController.findByPk);
route.put('/:id', StockEmployeeController.edit);
route.delete('/:id', StockEmployeeController.delete);

module.exports = route;