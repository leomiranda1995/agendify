const { Router } = require('express');
const ServiceController = require('../app/controllers/ServiceController');
const authMiddleware = require('../middlewares/authMiddleware');

const serviceRouter = Router();

serviceRouter.get('/services', authMiddleware, ServiceController.index);
serviceRouter.get('/services/:id', authMiddleware, ServiceController.show);
serviceRouter.post('/services', authMiddleware, ServiceController.store);
serviceRouter.put('/services/:id', authMiddleware, ServiceController.update);
serviceRouter.delete('/services/:id', authMiddleware, ServiceController.delete);

module.exports = serviceRouter;
