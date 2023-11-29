const { Router } = require('express');
const EventController = require('../app/controllers/EventController');

const routerEvent = Router();

routerEvent.post('/events', EventController.index);
routerEvent.get('/events/:eventId', EventController.show);

module.exports = routerEvent;
