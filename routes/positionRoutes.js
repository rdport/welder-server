const route = require('express').Router();
const PositionController = require('../controllers/PositionController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Position'), PositionController.showAll);
route.post('/register', PositionController.register);
route.post('/:id', PositionController.findByPk);
route.put('/:id', PositionController.edit);
route.delete('/:id', PositionController.delete);

module.exports = route;