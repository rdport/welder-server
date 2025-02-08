const route = require('express').Router();
const AccountController = require('../controllers/AccountController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');
const generateOptions = require('../middlewares/generateOptions');

route.use(authentication);
route.post('/', resultFilterPaginator('Account'), AccountController.showAll);
route.post('/options', generateOptions('Account'), AccountController.showOptions);
route.post('/register', AccountController.register);
route.post('/:id', AccountController.findByPk);
route.put('/:id', AccountController.edit);
route.delete('/:id', AccountController.delete);

module.exports = route;