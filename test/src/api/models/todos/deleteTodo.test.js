const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { Todo, sequelize } = require('../../../../../src/db/models/index');

const INVALID_ID = 99999999999;
const endPoints = [];
const END_POINT_PREFIX = '/api/todos';
const idList = [];
describe('test DELETE /api/todos/:id', () => {
  before(async () => {
    const testTodos = [];
    for (let i = 0; i < 5; i++) {
      const testData = {
        title: `テストタイトル${i + 1}`,
        body: `テスト文${i + 1}`,
      };
      const testTodo = Todo.create(testData);
      testTodos.push(testTodo);
    }
    await Promise.all(testTodos);
  });
  after(async () => {
    await sequelize.truncate();
  });
  it('returns response.body', async () => {
    // old
    const response = await requestHelper.request({
      method: 'get',
      endPoint: END_POINT_PREFIX,
      statusCode: 200,
    });
    const oldTodos = response.body;
    
    //削除するidを取得してidListに追加する
    ids = oldTodos.map((obj) => obj.id);
    ids.forEach((id) => {
      idList.push(id);
    });
    
    // delete
    // const promises = oldTodos.map(({id}) => {
    const promises = idList.map((id) => {
      const endPoint = `${END_POINT_PREFIX}/${id}`;
      endPoints.push(endPoint);
      return requestHelper.request({
        method: 'delete',
        endPoint,
        statusCode: 200,
      });
    });


    const deletedResponse = await Promise.all(promises);
    deletedResponse.forEach(( { body } ) => {
      assert.deepStrictEqual(
        { ...body },
        {
          id: body.id,
          title: body.title,
          body: body.body,
          completed: body.completed,
          createdAt: body.createdAt,
          updatedAt: body.updatedAt,
        }
      );
      const oldTodo = oldTodos.find(todo => todo.id === body.id);
      assert.deepStrictEqual(body.title, oldTodo.title);
      assert.deepStrictEqual(body.body, oldTodo.body);
      assert.deepStrictEqual(body.completed, oldTodo.completed);
      assert.deepStrictEqual(body.createdAt, oldTodo.createdAt);
      assert.deepStrictEqual(body.updatedAt, oldTodo.updatedAt);
    });
  });

 it( 'is completed?', async () => {
    const promises = idList.map((id) => {
      const endPoint = `${END_POINT_PREFIX}/${id}`;
      endPoints.push(endPoint);
      return requestHelper.request({
        method: 'delete',
        endPoint,
        statusCode: 404,
      });
    });
    
    const responseList = await Promise.all(promises);
    responseList.forEach(({ body, status }, i) => {
      assert.strictEqual(status, 404);
      assert.strictEqual(typeof body, 'object');
      assert.strictEqual(
        body.error.message,
        `Couldn't find a todo of ID ${idList[i]}`
      );
    });
  });

  it('return ID is required', async () => {
    const { body, status } = await requestHelper.request({
      method: 'delete',
      endPoint: `${END_POINT_PREFIX}/-10`,
      statusCode: 400,
    });

    assert.strictEqual(status, 400);
    assert.strictEqual(typeof body, 'object');
    assert.strictEqual(
      body.error.message, 'idは必須です(1以上の数値)'
    );
  });

  it("returns Couldn't find a todo of ID", async () => {
    const { body, status } = await requestHelper
      .request({
        method: 'delete',
        endPoint: `${END_POINT_PREFIX}/${INVALID_ID}`,
        statusCode: 404,
      });

    assert.strictEqual(status, 404);
    assert.strictEqual(typeof body, 'object');
    assert.strictEqual(
      body.error.message,
      `Couldn't find a todo of ID ${INVALID_ID}`
    );
  });
});

describe('test DELETE /api/todos', () => {
  it('response 404 json', async () => {
    const { body, status } = await requestHelper.request({
      method: 'delete',
      endPoint: END_POINT_PREFIX,
      statusCode: 404,
    });

    assert.strictEqual(status, 404);
    assert.strictEqual(typeof body, 'object');
    assert.strictEqual(
      body.error.message,
      '/api/todosのサーバーの IP アドレスが見つかりませんでした。'
    );
  });
});