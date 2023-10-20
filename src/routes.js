const { Router } = require('express');
const ProfessionalController = require('./app/controllers/ProfessionalController');
const ServiceController = require('./app/controllers/ServiceController');

const router = Router();

router.get('/professionals', ProfessionalController.index);
router.get('/professionals/:id', ProfessionalController.show);
router.post('/professionals', ProfessionalController.store);
router.put('/professionals/:id', ProfessionalController.update);
router.delete('/professionals/:id', ProfessionalController.delete);

router.get('/services', ServiceController.index);
router.get('/services/:id', ServiceController.show);
router.get('/services/professional/:id', ServiceController.showByProfessional);
router.post('/services', ServiceController.store);
router.put('/services/:id', ServiceController.update);
router.delete('/services/:id', ServiceController.delete);

module.exports = router;
