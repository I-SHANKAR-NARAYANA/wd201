/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    ovd = all.filter((item) => item.dueDate == yesterday);
    return ovd;
  };

  const dueToday = () => {
    dt = all.filter((item) => item.dueDate == today);
    return dt;
  };

  const dueLater = () => {
    dtt = all.filter((item) => item.dueDate == tomorrow);
    return dtt;
  };

  const toDisplayableList = (tasks) => {
    if (tasks[0].dueDate == yesterday) {
      const yesterdayFormatted = tasks
        .map((task) => "[ ]" + " " + task.title + " " + yesterday)
        .join("\n");
      return yesterdayFormatted;
    } else if (tasks[0].dueDate == today) {
      let formattedTasks = "";
      for (let i = 0; i < tasks.length; i++) {
        if (i == 0) {
          formattedTasks += "[x]" + " " + tasks[i].title + " " + "\n";
        } else {
          formattedTasks += "[ ]" + " " + tasks[i].title;
        }
      }
      return formattedTasks;
    } else {
      const tomorrowFormatted = tasks
        .map((task) => "[ ]" + " " + task.title + " " + tomorrow)
        .join("\n");
      return tomorrowFormatted;
    }
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

const todos = todoList();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1)),
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1)),
);

todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
todos.add({ title: "Pay rent", dueDate: today, completed: true });
todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });

console.log("My Todo-list\n");

console.log("Overdue");
var overdues = todos.overdue();
var formattedOverdues = todos.toDisplayableList(overdues);
console.log(formattedOverdues);
console.log("\n");

console.log("Due Today");
let itemsDueToday = todos.dueToday();
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
console.log(formattedItemsDueToday);
console.log("\n");

console.log("Due Later");
let itemsDueLater = todos.dueLater();
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
console.log(formattedItemsDueLater);
console.log("\n\n");

module.exports = todoList;
