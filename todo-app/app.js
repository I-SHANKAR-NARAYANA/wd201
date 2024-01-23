/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  try {
    const overdue = await Todo.getOverdueTodos();
    const duetoday = await Todo.getDueTodayTodos();
    const duelater = await Todo.getDueLaterTodos();
    const completed = await Todo.getCompletedTodos();

    if (request.accepts("html")) {
      response.render("index.ejs", {
        overdue,
        duetoday,
        duelater,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdue,
        duetoday,
        duelater,
        completed,
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
    return response.send(todos);
  } catch (err) {
    console.log(err);
    return response.status(422).json(err);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const status = todo.completed;
    const updatedTodo = await todo.setCompletionStatus(!status);
    return response.json(updatedTodo).status(200);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    if (todo) {
      todo.destroy();
      return response.send(true);
    } else {
      return response.send(false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
