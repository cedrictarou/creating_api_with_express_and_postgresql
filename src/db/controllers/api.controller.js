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
  async putTodo(req, res, next) {
    let transaction;
    try {
      const parsedId = parseInt(req.params.id, 10);
      //idが1未満やないときのエラー
      if (parsedId < 1 || isNaN(parsedId)) {
        const error = new Error('idは必須です(1以上の数値)');
        error.status = STATUS_CODES.BAD_REQUEST;
        return next(error);
      }
      transaction = await models.sequelize.transaction();
      const todo = await models.Todo.findByPk(parsedId, { transaction });
      //todoがないときのエラー
      if (!todo) {
        const error = new Error(`Couldn't find a todo of ID ${parsedId}`);
        error.status = STATUS_CODES.NOT_FOUND;
        throw error;
      }
      //todo内容のそれぞれのプロパティを更新する
      for(let prop in req.body) {
        if(prop !== 'id') {
          todo[prop] = req.body[prop];
          console.log(todo[prop]);
        }
      }
      await todo.save({ transaction });
      await transaction.commit();
      res.status(STATUS_CODES.OK).json(todo);
    } catch (error) {
      await transaction.rollback();
      if (!error.status) {
        error.status = STATUS_CODES.BAD_REQUEST;
      }
      next(error);
    }
  },

  // Delete
  async deleteTodo(req, res, next){
    let transaction;
    try{
      const parsedId = parseInt(req.params.id, 10);
      //idが1未満やないときのエラー
      if (parsedId < 1 || isNaN(parsedId)) {
        const error = new Error('idは必須です(1以上の数値)');
        error.status = STATUS_CODES.BAD_REQUEST;
        next(error);
      }
      transaction = await models.sequelize.transaction();
      const todo = await models.Todo.findByPk(parsedId, { transaction });
      // todoがないときエラーを返す
      if (!todo) {
        const error = new Error(`Couldn't find a todo of ID ${parsedId}`);
        error.status = STATUS_CODES.NOT_FOUND;
        next(error);
      }
      // 正常な処理
      await todo.destroy({ transaction });
      await transaction.commit();
      res.status(STATUS_CODES.OK).json(todo.dataValues);
    } catch(error) {
      await transaction.rollback();
      if (!error.status) {
        error.status = STATUS_CODES.BAD_REQUEST;
      }
      next(error);
    }
  }
};