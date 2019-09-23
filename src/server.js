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

// endPointミス
app.use(function(req, res, next) {
  const err = new Error(
    `${req.originalUrl}のサーバーの IP アドレスが見つかりませんでした。`
  );
  err.status = 404;
  next(err);
});

// エラーハンドリング
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).json({
    error: {
      message: err.message || 'oops! something went wrong!',
    },
  });
});

module.exports = app;