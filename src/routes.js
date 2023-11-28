const { Router } = require('express');
const UserController = require('./app/controllers/UserController');
const ServiceController = require('./app/controllers/ServiceController');
const EventController = require('./app/controllers/EventController');

const router = Router();

router.get('/users', UserController.index);
router.get('/users/:user_id', UserController.show);
router.post('/users', UserController.store);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.post('/services', ServiceController.store);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

router.post('/events', EventController.index);
router.get('/events/:eventId', EventController.show);

module.exports = router;
