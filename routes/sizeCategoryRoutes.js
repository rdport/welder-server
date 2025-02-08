const route = require('express').Router();
const SizeCategoryController = require('../controllers/SizeCategoryController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('SizeCategory'), SizeCategoryController.showAll);
route.post('/register', SizeCategoryController.register);
route.post('/:id', SizeCategoryController.findByPk);
route.put('/:id', SizeCategoryController.edit);
route.delete('/:id', SizeCategoryController.delete);

module.exports = route;