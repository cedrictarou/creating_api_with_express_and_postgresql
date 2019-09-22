const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { Todo, sequelize } = require('../../../../../src/db/models/index');


describe('test get/api/todos', () => {
  before(async () => {
    for (let i = 0; i < 5; i++) {
      const testdata = {
        title: `テストタイトル${i + 1}`,
        body: `テスト文${i + 1}`,
        completed: 'false',
      };
      await Todo.create(testdata);
    }
  });
  after(async () => {
    await sequelize.truncate();
    await sequelize.close();
  });

  it('returns todos in response.body', async() => {
    const response = await requestHelper.request({
      method: 'get',
      endoPoint: '/api/todos',
      statusCode: 200,
    });

    const todos = response.body;

    assert.equal(Array.isArray(todos), true);
    todos.forEach(todo => {
      assert.equal(typeof todo.id, 'number');
      assert.equal(typeof todo.title, 'string');
      assert.equal(typeof todo.body, 'string');
      assert.equal(typeof todo.completed, 'boolean');
      assert.equal(typeof todo.createdAt, 'string');
      assert.equal(typeof todo.updatedAt, 'string');
    });
  });
});

describe('test GET /api/===', () => {
  it('response 404 json', async () => {
    await requestHelper.request({
      method: 'get',
      endPoint: '/api/===',
      statusCode: 404,
    });
  });
});