const { Router } = require('express');
const EventController = require('../app/controllers/EventController');

const routerEvent = Router();

routerEvent.post('/events/list', EventController.index);
routerEvent.get('/events/:eventId', EventController.show);
routerEvent.post('/events', EventController.store);
routerEvent.put('/events/:id', EventController.update);
routerEvent.delete('/events/:id', EventController.delete);

module.exports = routerEvent;
