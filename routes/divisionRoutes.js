const route = require('express').Router();
const DivisionController = require('../controllers/DivisionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Division'), DivisionController.showAll);
route.post('/register', DivisionController.register);
route.post('/:id', DivisionController.findByPk);
route.put('/:id', DivisionController.edit);
route.delete('/:id', DivisionController.delete);

module.exports = route;