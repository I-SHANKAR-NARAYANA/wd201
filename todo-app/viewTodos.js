const { Todo } = require("./models");

async function viewTodos() {
    try {
        const todos = await Todo.findAll();
        console.log("Todos:", todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
    } finally {
        process.exit();
    }
}

viewTodos();
