const { Router } = require('express');
const ScheduleController = require('../app/controllers/ScheduleController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = Router();

userRouter.post('/schedule/professional', authMiddleware, ScheduleController.listScheduleProfessional);
// userRouter.get('/schedule/config/:schedule_id', ScheduleController.show);
// userRouter.post('/schedule/config', ScheduleController.store);
// userRouter.put('/schedule/config/:id', ScheduleController.update);

module.exports = userRouter;
