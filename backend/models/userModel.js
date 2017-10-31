'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {

  return sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING(45),
    },
    format: {
      type: Sequelize.STRING(45),
    },
    language: {
      type: Sequelize.STRING(45),
    },
    position: {
      type: Sequelize.STRING(45),
    },
  });
};
