const route = require('express').Router();
const ProductController = require('../controllers/ProductController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Product'), ProductController.showAll);
route.post('/register', ProductController.register);
route.post('/:id', ProductController.findByPk);
route.put('/:id', ProductController.edit);
route.patch('/:id', ProductController.rearrange);
route.delete('/:id', ProductController.delete);

module.exports = route;