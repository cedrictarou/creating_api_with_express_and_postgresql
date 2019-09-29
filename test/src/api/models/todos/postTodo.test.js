const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { sequelize } = require('../../../../../src/db/models/index');
// const app = require('../../../../../src/server');

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

  it('returns null title is 400 error', async () => {
    const testData = {
      body: 'test body',
    };
    const { body, status } = await requestHelper
      .request({
        method: 'post',
        endPoint: '/api/todos',
        statusCode: 400,
      }).send(testData);
      assert.equal(status, 400);
      assert.equal(typeof body, 'object');
      assert.equal(
        body.error.message,
        '見入力の値があります。'
      );
  });

  it('returns null body is 400 error', async () => {
    const testData = {
      title: 'test title',
    };
    const { body, status } = await requestHelper
      .request({
        method: 'post',
        endPoint: '/api/todos',
        statusCode: 400,
      }).send(testData);
      assert.equal(status, 400);
      assert.equal(typeof body, 'object');
      assert.equal(
        body.error.message,
        '見入力の値があります。'
      );
  });

  describe('test POST /api/===', () => {
    it('response 404 json', async () => {
      const { body, status } = await requestHelper.request({
        method: 'post',
        endPoint: '/api/===',
        statusCode: 404,
      });
  
      assert.equal(status, 404);
      assert.equal(typeof body, 'object');
      assert.equal(body.error.message,'/api/===のサーバーの IP アドレスが見つかりませんでした。');
    });
  });
});