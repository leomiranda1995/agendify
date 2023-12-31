const express = require('express');
require('express-async-errors');

const routesUser = require('./routes/routesUser');
const routesService = require('./routes/routesService');
const routesEvent = require('./routes/routesEvent');
const routesScheduleConfig = require('./routes/routesScheduleConfig');
const routesSchedule = require('./routes/routesSchedule');

const app = express();

// app.use((request, response, next) => {
//   // Middlewares no Express
//   request.appId = 1;
//   next();
// });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

app.use(routesUser);
app.use(routesService);
app.use(routesEvent);
app.use(routesScheduleConfig);
app.use(routesSchedule);

app.use((error, request, response, next) => {
  console.log('##### Error Handler');
  console.log(error);
  response.sendStatus(500);
});

app.listen(3000, () => console.log('Server started at http://localhost:3000'));
