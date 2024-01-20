/* eslint-disable lines-between-class-members */
/* eslint-disable object-shorthand */
/* eslint-disable quotes */
/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable eol-last */
/* eslint-disable semi */
"use strict";
const { Model } = require("sequelize");
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
          completed: false,
        });
        const alTodos = await this.findAll();
        return alTodos;
      }
    }
    markAsCompleted() {
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
