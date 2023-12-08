const { Router } = require('express');
const UserController = require('../app/controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = Router();

userRouter.get('/users', UserController.index); // sem auth
userRouter.get('/users/:user_id', authMiddleware, UserController.show);
userRouter.post('/users', UserController.store); // sem auth
userRouter.put('/users/:id', authMiddleware, UserController.update);
userRouter.delete('/users/:id', authMiddleware, UserController.delete);

userRouter.post('/login', UserController.login); // sem auth

module.exports = userRouter;
