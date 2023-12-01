const { Router } = require('express');
const EventController = require('../app/controllers/EventController');
const authMiddleware = require('../middlewares/authMiddleware');

const routerEvent = Router();

routerEvent.post('/events/list', authMiddleware, EventController.index);
routerEvent.get('/events/:eventId', authMiddleware, EventController.show);
routerEvent.post('/events', authMiddleware, EventController.store);
routerEvent.put('/events/:id', authMiddleware, EventController.update);
routerEvent.delete('/events/:id', authMiddleware, EventController.delete);

module.exports = routerEvent;
