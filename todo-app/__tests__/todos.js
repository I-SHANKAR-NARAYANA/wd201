/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3002, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const token = extractToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: token,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let token = extractToken(res);
    const status = false;
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: status,
    });
    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const sortedTodos = parsedGroupedTodosResponse.duetoday.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const latestTodo = sortedTodos[0];
    res = await agent.get("/");
    token = extractToken(res);
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: token });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(!status);
  });

  // test('Fetches all todos in the database using /todos endpoint', async () => {
  //   await agent.post('/todos').send({
  //     title: 'Buy xbox',
  //     dueDate: new Date().toISOString(),
  //     completed: false
  //   })
  //   await agent.post('/todos').send({
  //     title: 'Buy ps3',
  //     dueDate: new Date().toISOString(),
  //     completed: false
  //   })
  //   const response = await agent.get('/todos')
  //   const parsedResponse = JSON.parse(response.text)
  //   expect(parsedResponse.length).toBe(4)
  //   expect(parsedResponse[3].title).toBe('Buy ps3')
  // })

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    let res = await agent.get("/");
    let token = extractToken(res);
    await agent.post("/todos").send({
      title: "Delete me",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedTodosResponse = JSON.parse(groupedTodosResponse.text);
    const sortedTodos = parsedGroupedTodosResponse.duetoday.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const latestTodo = sortedTodos[0];
    res = await agent.get("/");
    token = extractToken(res);
    const deleteResponse = await agent
      .delete(`/todos/${latestTodo.id}`)
      .send({ _csrf: token });
    const parseddeleteResponse = JSON.parse(deleteResponse.text);
    expect(Boolean(parseddeleteResponse)).toBe(true);
  });
});
