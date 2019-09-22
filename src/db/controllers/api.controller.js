// それぞれのリクエストの実行内容

'use strict'
const Todo = require('../models/index').Todo;

module.exports = {
  // Read
  async getTodos(req, res) {
    const todos = await Todo.findAll({
      order: [
        ['id', 'ASC']
      ],
      raw: true
    });

    res.status(200).json(todos);
  },


  // Create
  postTodo: (req, res) => {
    res.status(200).send("add todos to db");
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