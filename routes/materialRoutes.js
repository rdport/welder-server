const route = require('express').Router();
const MaterialController = require('../controllers/MaterialController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');
const generateOptions = require('../middlewares/generateOptions');

route.use(authentication);
route.post('/', resultFilterPaginator('Material'), MaterialController.showAll);
route.post('/options', generateOptions('Material'), MaterialController.showOptions);
route.post('/register', MaterialController.register);
route.post('/:id', MaterialController.findByPk);
route.put('/:id', MaterialController.edit);
route.patch('/:id', MaterialController.rearrange);
route.delete('/:id', MaterialController.delete);

module.exports = route;