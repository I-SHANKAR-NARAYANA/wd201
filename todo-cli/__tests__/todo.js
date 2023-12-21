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
    add({
      title: "Overdues Todo",
      completed: false,
      dueDate: "2023-01-01",
    });

    const allOverDue = overdue();

    expect(allOverDue.length).toBe(1);
    expect(allOverDue[0].title).toBe("Overdues Todo");
  });

  test("Should Retrieve DueToday Todos", () => {
    add({
      title: "DueToday Todo",
      completed: false,
      dueDate: todayDate,
    });

    const todayDueItems = dueToday();

    expect(todayDueItems.length).toBe(1);
    expect(todayDueItems[0].title).toBe("DueToday Todo");
  });

  test("Should Retrieve DueLater Todos", () => {
    add({
      title: "DueLater Todo",
      completed: false,
      dueDate: "2023-12-31",
    });

    const dueLaterItems = dueLater();

    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("DueLater Todo");
  });
});
