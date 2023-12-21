/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todo List Test Suite", () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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
      expect(new Date(todo.dueDate)).toEqual(yesterday);
    });
    add({
      title: "Overdue Todo Title",
      completed: false,
      dueDate: yesterday.toISOString().slice(0, 10),
    });
    expect(overdueTodos.length).toBe(1);
    expect(overdueTodos[0].title).toBe("Overdue Todo Title");
  });

  test("Should Retrieve DueToday Todos", () => {
    const dueTodayTodos = dueToday();
    const today = new Date().toISOString().slice(0, 10);
    dueTodayTodos.forEach((todo) => {
      expect(new Date(todo.dueDate)).toEqual(new Date(today));
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
      expect(new Date(todo.dueDate)).toEqual(tomorrow);
    });
    add({
      title: "DueLater Todo Title",
      completed: false,
      dueDate: tomorrow.toISOString().slice(0, 10),
    });
    expect(dueLaterTodos.length).toBe(1);
    expect(dueLaterTodos[0].title).toBe("DueLater Todo Title");
  });
});
