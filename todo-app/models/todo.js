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
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static deleteTodo(id) {
      return this.destroy({ where: { id: id } });
    }

    // eslint-disable-next-line no-unused-vars
    static async setCompletionStatus(id, val, userId) {
      const todo = await this.findByPk(id);
      todo.completed = val;
      await todo.save();
      return todo;
    }

    static getTodos() {
      return this.findAll();
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    static async isDueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async isOverdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
          completed: false,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static async isDueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static isCompleted(userId) {
      return this.findAll({
        where: { completed: true },
        userId,
        order: [["id", "ASC"]],
      });
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
