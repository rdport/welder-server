const route = require('express').Router();
const SizeController = require('../controllers/SizeController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');
const generateOptions = require('../middlewares/generateOptions');

route.use(authentication);
route.post('/', resultFilterPaginator('Size'), SizeController.showAll);
route.post('/options', generateOptions('Size'), SizeController.showOptions);
route.post('/register', SizeController.register);
route.post('/:id', SizeController.findByPk);
route.put('/:id', SizeController.edit);
route.patch('/:id', SizeController.rearrange);
route.delete('/:id', SizeController.delete);

module.exports = route;