const route = require('express').Router();
const AdminController = require('../controllers/AdminController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.post('/login', AdminController.login);
route.post('/refresh-token', AdminController.refreshToken);
route.use(authentication);
route.post('/logout', AdminController.logout);
route.post('/logout-all', AdminController.logoutAll);
route.use(authorization);
route.post('/', resultFilterPaginator('Admin'), AdminController.showAll);
route.post('/register', AdminController.register);
route.post('/:id', AdminController.findByPk);
route.put('/:id', AdminController.edit);
route.delete('/:id', AdminController.delete);

module.exports = route;