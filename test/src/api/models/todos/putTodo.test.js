const assert = require('power-assert');
const requestHelper = require('../../../../helper/requestHelper');
const { Todo, sequelize } = require('../../../../../src/db/models/index');

const INVALID_ID = 99999999999;
describe('test PUT /api/todos/:id', () => {
  before(async () => {
    for (let i = 0; i < 5; i++) {
      const testData = {
        title: `テストタイトル${i + 1}`,
        body: `テスト文${i + 1}`,
      };
      await Todo.create(testData);
    }
  });
  after(async () => {
    await sequelize.truncate();
    await sequelize.close();
  });

  it('returns response.body', async () => {
    // old
    const response = await requestHelper.request({
      method: 'get',
      endPoint: '/api/todos',
      statusCode: 200,
    });
    const oldTodos = response.body;
    console.log(oldTodos, '2@@@@@@@@@@@@@@@@');
    // oldTodoのそれぞれのプロパティをupdateする
    const updateTodos = oldTodos.map((todo, i) => {
      const putData = {
        title: `アップデートタイトル${i + 1}`,
        body: `アップデート文${i + 1}`,
      };
      return requestHelper
        .request({
          method: 'put',
          endPoint: `/api/todos/${todo.id}`,
          statusCode: 200,
        }).send(putData);
    });
    const newTodos = await Promise.all(updateTodos);
    newTodos.forEach(({ body }) => {
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
      assert.notStrictEqual(body.title, oldTodo.title);
      assert.notStrictEqual(body.body, oldTodo.body);
      assert.notStrictEqual(body.updatedAt, oldTodo.updatedAt);
    });
  });

  it('returns ID is required', async () => {
    const putData = {
      title: 'アップデートタイトル',
      body: 'アップデート文',
    };

    const { body, status } = await requestHelper
      .request({
        method: 'put',
        endPoint: `/api/todos/-10`,
        statusCode: 400,
      })
      .send(putData);

    assert.equal(status, 400);
    assert.equal(typeof body, 'object');
    assert.equal(body.error.message, 'idは必須です(1以上の数値)');
  });

  it("returns Couldn't find a todo of ID", async () => {
    const putData = {
      title: 'アップデートタイトル',
      body: 'アップデート文',
    };

    const { body, status } = await requestHelper
      .request({
        method: 'put',
        endPoint: `/api/todos/${INVALID_ID}`,
        statusCode: 404,
      })
      .send(putData);

    assert.equal(status, 404);
    assert.equal(typeof body, 'object');
    assert.equal(
      body.error.message,
      `Couldn't find a todo of ID ${INVALID_ID}`
    );
  });
});

describe('test PUT /api/todos', () => {
  it('response 404 json', async () => {
    const { body, status } = await requestHelper.request({
      method: 'put',
      endPoint: '/api/todos',
      statusCode: 404,
    });

    assert.equal(status, 404);
    assert.equal(typeof body, 'object');
    assert.equal(
      body.error.message,
      '/api/todosのサーバーの IP アドレスが見つかりませんでした。'
    );
  });
});