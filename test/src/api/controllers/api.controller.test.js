const assert = require('power-assert');
const todosController = require('../../../../src/db/controllers/api.controller');
const app = require('../../../../src/server');

describe('todosController', () => {
  it('has getTodos method', () => {
    assert.equal(typeof todosController.getTodos === 'function', true);
  });

  it('has postTodo method', () => {
    assert.equal(typeof todosController.postTodo === 'function', true);
  });

  it('has putTodo method', () => {
    assert.equal(typeof todosController.putTodo === 'function', true);
  });

  it('has deleteTodo method', () => {
    assert.equal(typeof todosController.deleteTodo === 'function', true);
  });
});