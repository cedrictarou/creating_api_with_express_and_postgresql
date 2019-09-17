// リクエストを送る先を決める処理

'use strict'
const express = require('express');
const router = express.Router();
const controller = require('../controllers/api.controller');

router.route('/todos')
  .get(controller.getTodos)
  .post(controller.postTodo)
  .put(controller.putTodo)
  .delete(controller.deleteTodo);

router.route('/todos/:id')
  .put(controller.putTodo)
  .delete(controller.deleteTodo);

module.exports = router;