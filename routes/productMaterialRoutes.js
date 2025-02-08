const route = require('express').Router();
const ProductMaterialController = require('../controllers/ProductMaterialController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('ProductMaterial'), ProductMaterialController.showAll);
route.post('/register', ProductMaterialController.register);
route.post('/:id', ProductMaterialController.findByPk);
route.put('/:id', ProductMaterialController.edit);
route.patch('/:id', ProductMaterialController.rearrange);
route.delete('/:id/', ProductMaterialController.delete);

module.exports = route;