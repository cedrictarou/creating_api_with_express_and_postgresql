const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { Todo, sequelize } = require('../../../../../src/db/models/index');


describe('test get/api/todos', () => {
  console.log('@@@@@@@@@@@@@@01');
  before(async () => {
    for (let i = 0; i < 5; i++) {
      const testdata = {
        title: `テストタイトル+${i + 1}`,
        body: `テストボディ+${i + 1}`,
        completed: 'false',
      };
      await Todo.create(testdata);
      console.log('@@@@@@@@@@@@@@02');
    }
  });
  after(async () => {
    await sequelize.truncate();
    await sequelize.close();
  console.log('@@@@@@@@@@@@@3');
  });

  it('returns todos in response.body', async() => {
    console.log('@@@@@@@@@@@@@@04');
    const response = await requestHelper.request({
      method: 'get',
      endoPoint: '/api/todos',
      statusCode: 200,
    });
    
    console.log('@@@@@@@@@@@@@@5');
    const todos = response.body;
    console.log('@@@@@@@@@@@@@@6');
    assert.equal(Array.isArray(todos), true);
    todos.forEach(todo => {
      console.log('@@@@@@@@@@@@@@07');
      assert.equal(typeof todo.id, 'number');
      assert.equal(typeof todo.title, 'string');
      assert.equal(typeof todo.body, 'string');
      assert.equal(typeof todo.completed, 'boolean');
      assert.equal(typeof todo.createdAt, 'string');
      assert.equal(typeof todo.updatedAt, 'string');
      console.log('@@@@@@@@@@@@@@8');
    });
    console.log('@@@@@@@@@@@@@@9');
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