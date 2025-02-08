const route = require('express').Router();
const BrandCategoryController = require('../controllers/BrandCategoryController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('BrandCategory'), BrandCategoryController.showAll);
route.post('/register', BrandCategoryController.register);
route.post('/:id', BrandCategoryController.findByPk);
route.put('/:id', BrandCategoryController.edit);
route.delete('/:id', BrandCategoryController.delete);

module.exports = route;