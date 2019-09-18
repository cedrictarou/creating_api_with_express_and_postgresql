// それぞれのリクエストの実行内容

'use strict'

module.exports = {
  // Read
  getTodos: (req, res) => {
    res.status(200).send("get todos from db");
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