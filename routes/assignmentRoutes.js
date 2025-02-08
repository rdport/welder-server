const route = require('express').Router();
const AssignmentController = require('../controllers/AssignmentController');
const authentication = require('../middlewares/authentication');
const resultFilterPaginator = require('../middlewares/resultFilterPaginator');

route.use(authentication);
route.post('/', resultFilterPaginator('Assignment'), AssignmentController.showAll);
route.post('/register', AssignmentController.register);
route.post('/:id', AssignmentController.findByPk);
route.put('/:id', AssignmentController.edit);
route.delete('/:id', AssignmentController.delete);

module.exports = route;