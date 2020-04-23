const Sequelize = require('sequelize');
const db = require('../config/database');

const Teacher = db.define('teachers', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  }

})

module.exports = Teacher;