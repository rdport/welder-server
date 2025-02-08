const route = require('express').Router();
const EmployeeController = require('../controllers/EmployeeController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.use(authorization);
route.post('/', resultFilterPaginator('Employee'), EmployeeController.showAll);
route.post('/register', EmployeeController.register);
route.post('/:id', EmployeeController.findByPk);
route.put('/:id', EmployeeController.edit);
route.delete('/:id', EmployeeController.delete);

module.exports = route;