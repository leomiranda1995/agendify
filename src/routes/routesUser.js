const { Router } = require('express');
const UserController = require('../app/controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

const userRouter = Router();

userRouter.get('/users', authMiddleware, UserController.index);
userRouter.get('/users/:user_id', authMiddleware, authMiddleware, UserController.show);
userRouter.post('/users', UserController.store);
userRouter.put('/users/:id', authMiddleware, UserController.update);
userRouter.delete('/users/:id', authMiddleware, UserController.delete);

userRouter.post('/login', UserController.login);

module.exports = userRouter;
