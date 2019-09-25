// それぞれのリクエストの実行内容

'use strict'
const models = require('../models/index');

module.exports = {
  // Read 
 async getTodos(req, res) {
    const storedTodos = await models.Todo.findAll({
      order: [
        ['id', 'ASC']
      ],
      raw: true
    });
    res.status(200).json(storedTodos);
  },

  // Create
  async postTodo(req, res) {
    let transaction;
    try {
      transaction = await models.sequelize.transaction();
      const createdTodo = await models.Todo.create({
        title: req.body.title,
        body: req.body.body,
      }, { transaction });

      await transaction.commit();
      res.status(200).json(createdTodo);
    } catch (error) {
      res.status(404).json({message: error.message});
    }
  },
  
  // Update
  putTodo: (req, res) =>{
    const id = req.params.id;
    const message = `update todo of ${id} in db`;
    res.status(200).send(message);
  },
  // Delete
  deleteTodo: (req, res) =>{
    const id = req.params.id;
    const message = `delete todo of ${id} from db`;
    res.status(200).send(message);
  }
};