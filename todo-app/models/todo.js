/* eslint-disable lines-between-class-members */
/* eslint-disable object-shorthand */
/* eslint-disable quotes */
/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable eol-last */
/* eslint-disable semi */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static async getOverdueTodos() {
      try {
        const allTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
            completed: {
              [Op.ne]: true,
            },
          },
        });
        return allTodos;
      } catch (error) {
        console.error("Error getting overdue todos:", error);
        throw error;
      }
    }

    static async getDueTodayTodos() {
      try {
        const allTodos = await Todo.findAll({
          where: {
            dueDate: new Date().toISOString(),
            completed: false,
          },
        });

        return allTodos;
      } catch (error) {
        console.error("Error getting due today todos:", error);
        throw error;
      }
    }

    static async getDueLaterTodos() {
      try {
        const allTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
            completed: false,
          },
        });
        return allTodos;
      } catch (error) {
        console.error("Error getting due later todos:", error);
        throw error;
      }
    }
    static async getCompletedTodos() {
      try {
        const allCompletedTodos = await Todo.findAll({
          where: {
            completed: {
              [Op.ne]: false,
            },
          },
        });
        return allCompletedTodos;
      } catch (error) {
        console.error("Error getting completed todos:", error);
        throw error;
      }
    }

    static async getTodos() {
      const allTodos = await this.findAll();
      if (allTodos.length >= 1) {
        return allTodos;
      } else {
        await this.addTodo({
          title: "Buy milk",
          dueDate: new Date().toISOString(),
          completed: false,
        });
        await this.addTodo({
          title: "Buy xbox",
          dueDate: new Date().toISOString(),
          completed: true,
        });
        const alTodos = await this.findAll();
        return alTodos;
      }
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }

    markAsComplete() {
      return this.update({ completed: true });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
