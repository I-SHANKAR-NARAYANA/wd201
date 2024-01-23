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
        if (allTodos.length >= 1) {
          return allTodos;
        } else {
          await this.addTodo({
            title: "Buy eggs",
            dueDate: new Date(
              new Date().setDate(new Date().getDate() - 1)
            ).toISOString(),
            completed: false,
          });
          await this.addTodo({
            title: "Buy xboxes",
            dueDate: new Date(
              new Date().setDate(new Date().getDate() - 1)
            ).toISOString(),
            completed: false,
          });
          const comp = await Todo.findAll({
            where: {
              title: "Buy xboxes",
            },
          });
          comp[0].update({ completed: true });
          const allTodosAgain = await Todo.findAll({
            where: {
              title: "Buy eggs",
            },
          });
          return allTodosAgain;
        }
      } catch (error) {
        console.error("Error getting overdue todos:", error);
        throw error;
      }
    }

    static async getDueTodayTodos() {
      try {
        const existingTodos = await Todo.findAll({
          where: {
            dueDate: new Date().toISOString(),
            completed: false,
          },
        });

        if (existingTodos.length === 0) {
          await this.addTodo({
            title: "Buy today",
            dueDate: new Date().toISOString(),
            completed: false,
          });
        }

        const allTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.between]: [
                new Date(),
                new Date(new Date().setHours(23, 59, 59, 999)),
              ],
            },
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
        const existingTodos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
            completed: false,
          },
        });

        if (existingTodos.length === 0) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          await this.addTodo({
            title: "Buy later",
            dueDate: tomorrow.toISOString(),
            completed: false,
          });
        }

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
        console.log("helo1598", allCompletedTodos);
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
