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
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      competed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should Mark a Todo as Complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
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