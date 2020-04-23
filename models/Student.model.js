const Sequelize = require('sequelize');
const db = require('../config/database');

const Student = db.define('students', {
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
  },
  birth_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  }

})

module.exports = Student;