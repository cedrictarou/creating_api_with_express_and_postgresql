'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};