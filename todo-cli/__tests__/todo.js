const ToDoList = require("../todo");

describe("ToDoList Test Suite", () => {
  let toDoListInstance;

  beforeEach(() => {
    toDoListInstance = ToDoList();
  });

  test("Should create a new ToDo", () => {
    toDoListInstance.add({
      title: "New instance",
      completed: false,
      dueDate: "2023-12-31",
    });

    expect(toDoListInstance.all.length).toBe(1);
    expect(toDoListInstance.all[0].title).toBe("New instance");
  });

  test("Should mark a ToDo as completed after its completion", () => {
    toDoListInstance.add({
      title: "Incomplete ToDo",
      completed: false,
      dueDate: "2023-12-31",
    });

    toDoListInstance.markAsComplete(0);

    expect(toDoListInstance.all[0].completed).toBe(true);
  });

  test("Should retrieve overdue todos", () => {
    toDoListInstance.add({
      title: "New Overdue",
      completed: false,
      dueDate: "2023-01-01",
    });

    const allOverdueItems = toDoListInstance.overdue();

    expect(allOverdueItems.length).toBe(1);
    expect(allOverdueItems[0].title).toBe("New Overdue");
  });

  test("Should retrieve due today todos", () => {
    const todayDate = new Date().toISOString().split("T")[0];

    toDoListInstance.add({
      title: "New Due Today",
      completed: false,
      dueDate: todayDate,
    });

    const todayDueItems = toDoListInstance.dueToday();

    expect(todayDueItems.length).toBe(1);
    expect(todayDueItems[0].title).toBe("New Due Today");
  });

  test("Should retrieve due later todos", () => {
    toDoListInstance.add({
      title: "New Due Later",
      completed: false,
      dueDate: "2023-12-31",
    });

    const dueLaterItems = toDoListInstance.dueLater();

    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("New Due Later");
  });
});
