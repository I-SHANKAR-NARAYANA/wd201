/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo List Test Suite", () => {
  beforeAll(() => {
    add({
      title: "new todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });

  test("Should Add New Todo", () => {
    const initialTodoCount = all.length;
    const newTodo = {
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    };
    add(newTodo);
    expect(all.length).toBe(initialTodoCount + 1);
    expect(all[initialTodoCount]).toEqual(newTodo);
  });

  test("Should Mark a Todo as Complete", () => {
    const testTodo = {
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    };
    add(testTodo);
    const testTodoIndex = all.findIndex((todo) => todo === testTodo);
    expect(all[testTodoIndex].completed).toBe(false);
    markAsComplete(testTodoIndex);
    expect(all[testTodoIndex].completed).toBe(true);
  });

  test("Should Retrieve Overdue Todos", () => {
    const overdueTodos = overdue();
    overdueTodos.forEach((todo) => {
      expect(todo.dueDate).toBe(yesterday);
    });
  });

  test("Should Retrieve DueToday Todos", () => {
    const dueTodayTodos = dueToday();
    var dateToday = new Date();
    const today = dateToday.toISOString().split("T")[0];
    dueTodayTodos.forEach((todo) => {
      expect(todo.dueDate).toBe(today);
    });
  });

  test("Should Retrieve DueLater Todos", () => {
    const dueLaterTodos = dueLater();
    dueLaterTodos.forEach((todo) => {
      expect(todo.dueDate).toBe(tomorrow);
    });
  });
});
