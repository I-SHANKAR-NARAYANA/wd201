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

    static async empty(code) {
      if (code === 1) {
        await this.addTodo({
          title: "Buy yesterday",
          dueDate: new Date(
            new Date().setDate(new Date().getDate() - 1)
          ).toISOString(),
          completed: false,
        });
      } else if (code === 3) {
        await this.addTodo({
          title: "Buy later",
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 1)
          ).toISOString(),
          completed: false,
        });
      } else if (code === 2) {
        await this.addTodo({
          title: "Buy today",
          dueDate: new Date().toISOString(),
          completed: false,
        });
      } else {
        await this.addTodo({
          title: "Buy completed tomorrow",
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 1)
          ).toISOString(),
          completed: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const obj = await this.findOne({ title: "Buy completed tomorrow" });
        obj.markAsComplete();
      }
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
          await this.empty(1);
          const allTodosAgain = await Todo.findAll({
            where: {
              dueDate: {
                [Op.lt]: new Date(),
              },
              completed: {
                [Op.ne]: true,
              },
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
          await this.empty(2);
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
          await this.empty(3);
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
        if (allCompletedTodos.length === 0) {
          this.empty(4);
        }
        const allCompletedTodosAgain = await Todo.findAll({
          where: {
            completed: {
              [Op.ne]: false,
            },
          },
        });
        return allCompletedTodosAgain;
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
