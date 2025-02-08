const route = require('express').Router();
const DatebookController = require('../controllers/DatebookController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Datebook'), DatebookController.showAll);
route.post('/register', DatebookController.register);
route.post('/:id', DatebookController.findByPk);
route.put('/:id', DatebookController.edit);
route.delete('/:id', DatebookController.delete);

module.exports = route;