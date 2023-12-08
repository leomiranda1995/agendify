const { Router } = require('express');
const ScheduleConfigController = require('../app/controllers/ScheduleConfigController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = Router();

userRouter.get('/schedule/config', authMiddleware, ScheduleConfigController.index);
// userRouter.get('/schedule/config/:schedule_id', ScheduleConfigController.show);
// userRouter.post('/schedule/config', ScheduleConfigController.store);
userRouter.put('/schedule/config/:id', authMiddleware, ScheduleConfigController.update);

module.exports = userRouter;
