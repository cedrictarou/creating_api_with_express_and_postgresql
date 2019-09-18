// クライアントからのリクエストを処理する

const express = require('express');
const app = express();
const apiRouter = require('./db/routers/api.router');

app.use('/api/todos', [
  express.json(),
  express.urlencoded({extended: true}),
  apiRouter
]);

module.exports = app;