const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { Todo, sequelize } = require('../../../../../src/db/models/index');
 
describe('test POST /api/todos', () => {
  after(async () => {
    await sequelize.truncate();
    await sequelize.close();
  });

  it('returns response.body', async () => {
    const testData = {
      title: 'テストタイトル',
      body: 'テスト文',
    };

    const response = await requestHelper.request({
        method: 'post',
        endPoint: '/api/todos',
        statusCode: 200,
      }).send(testData);
      
    const createdTodo = response.body;
    assert.deepStrictEqual(
      { ...createdTodo },
      {
        id: createdTodo.id,
        title: testData.title,
        body: testData.body,
        completed: createdTodo.completed,
        createdAt: createdTodo.createdAt,
        updatedAt: createdTodo.updatedAt,
      }
    );
  });
});

describe('test POST /api/===', () => {
  it('response 404 json', async () => {
    await requestHelper.request({
      method: 'post',
      endPoint: '/api/===',
      statusCode: 404,
    });
  });
});