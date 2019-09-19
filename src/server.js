// クライアントからのリクエストを処理する

const express = require('express');
const app = express();
const apiRouter = require('./db/routers/api.router');

// middleware
const middlewareForAllowOrigin = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};

app.use('/api/todos', [
  middlewareForAllowOrigin,
  express.json(),
  express.urlencoded({extended: true}),
  apiRouter
]);

module.exports = app;