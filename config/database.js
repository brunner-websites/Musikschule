const Sequelize = require('sequelize');

const db = new Sequelize('musicschool', 'musikAdmin', 'biguns', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    freezeTableName: true,
    timestamps: false
  }
});

module.exports = db;