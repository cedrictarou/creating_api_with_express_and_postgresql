// それぞれのリクエストの実行内容

'use strict'
const models = require('../models/index');
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

module.exports = {
  // Read 
 async getTodos(req, res) {
    const storedTodos = await models.Todo.findAll({
      order: [
        ['id', 'ASC']
      ],
      raw: true
    });
    res.status(STATUS_CODES.OK).json(storedTodos);
  },

  // Create
  async postTodo(req, res, next) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const createdTodo = await models.Todo.create({
        title: req.body.title,
        body: req.body.body,
      }, { transaction });

      await transaction.commit();
      res.status(STATUS_CODES.OK).json(createdTodo);
    } catch (error) {
      await transaction.rollback();
      error.status = STATUS_CODES.BAD_REQUEST;
      error.message = '未入力の値があります。';
      next(error);
    }
  },
  
  // Update
  putTodo: (req, res) =>{
    const id = req.params.id;
    const message = `update todo of ${id} in db`;
    res.status(STATUS_CODES.OK).send(message);
  },
  // Delete
  deleteTodo: (req, res) =>{
    const id = req.params.id;
    const message = `delete todo of ${id} from db`;
    res.status(STATUS_CODES.OK).send(message);
  }
};