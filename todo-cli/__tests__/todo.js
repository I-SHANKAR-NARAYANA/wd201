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
    expect(all[initialTodoCount].title).toEqual("Test Todo");
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
    add({
      title: "Overdue Todo Title",
      completed: false,
      dueDate: "2023-01-01",
    });
    expect(overdueTodos.length).toBe(1);
    expect(overdueTodos[0].title).toBe("Overdue Todo Title")
  });

  test("Should Retrieve DueToday Todos", () => {
    const dueTodayTodos = dueToday();
    var dateToday = new Date();
    const today = dateToday.toISOString().split("T")[0];
    dueTodayTodos.forEach((todo) => {
      expect(todo.dueDate).toBe(today);
    });
    add({
      title: "DueToday Todo Title",
      completed: false,
      dueDate: today,
    });
    expect(dueTodayTodos.length).toBe(1);
    expect(dueTodayTodos[0].title).toBe("DueToday Todo Title");
  });

  test("Should Retrieve DueLater Todos", () => {
    const dueLaterTodos = dueLater();
    dueLaterTodos.forEach((todo) => {
      expect(todo.dueDate).toBe(tomorrow);
    });
    add({
      title: "DueLater Todo Title",
      completed: false,
      dueDate: "2023-12-31",
    });
    expect(dueLaterTodos.length).toBe(1);
    expect(dueLaterTodos[0].title).toBe("DueLater Todo Title");
  });
});
