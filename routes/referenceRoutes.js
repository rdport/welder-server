const route = require('express').Router();
const ReferenceController = require('../controllers/ReferenceController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Reference'), ReferenceController.showAll);
route.post('/register', ReferenceController.register);
route.post('/:id', ReferenceController.findByPk);
route.put('/:id', ReferenceController.edit);
route.delete('/:id', ReferenceController.delete);

module.exports = route;