const { Router } = require('express');
const ServiceController = require('../app/controllers/ServiceController');

const serviceRouter = Router();

serviceRouter.get('/services', ServiceController.index);
serviceRouter.get('/services/:id', ServiceController.show);
serviceRouter.post('/services', ServiceController.store);
serviceRouter.put('/services/:id', ServiceController.update);
serviceRouter.delete('/services/:id', ServiceController.delete);

module.exports = serviceRouter;
