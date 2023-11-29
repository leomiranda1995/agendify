const { Router } = require('express');
const UserController = require('../app/controllers/UserController');

const userRouter = Router();

userRouter.get('/users', UserController.index);
userRouter.get('/users/:user_id', UserController.show);
userRouter.post('/users', UserController.store);
userRouter.put('/users/:id', UserController.update);
userRouter.delete('/users/:id', UserController.delete);

module.exports = userRouter;
