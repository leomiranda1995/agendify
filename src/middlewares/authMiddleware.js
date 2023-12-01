// const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // const token = req.header('Authorization');

  // if (!token) {
  //   return res.status(401).json({ message: 'Token não fornecido' });
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.userId = decoded.userId;
  next();
  // } catch (error) {
  //   return res.status(401).json({ message: 'Token inválido' });
  // }
};

module.exports = authMiddleware;
