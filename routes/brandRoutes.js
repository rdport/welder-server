const route = require('express').Router();
const BrandController = require('../controllers/BrandController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');
const generateOptions = require('../middlewares/generateOptions');

route.use(authentication);
route.post('/', resultFilterPaginator('Brand'), BrandController.showAll);
route.post('/options', generateOptions('Brand'), BrandController.showOptions);
route.post('/register', BrandController.register);
route.post('/:id', BrandController.findByPk);
route.put('/:id', BrandController.edit);
route.patch('/:id', BrandController.rearrange);
route.delete('/:id', BrandController.delete);

module.exports = route;