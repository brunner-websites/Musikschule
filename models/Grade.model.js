const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('../models/User.model');
const Class = require('../models/Class.model');

const Grade = db.define('grades', {
  // attributes
  // id | grade | year | time_taken | time_updated | student_id (FK) | class_id (FK)

  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  grade: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  school_year: {
    type: Sequelize.STRING(9),
    allowNull: false
  },
  time_taken: {
    type: Sequelize.DATE,
    allowNull: false
  },
  time_updated: {
    type: Sequelize.DATE,
    allowNull: true
  },
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  class_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: 'id'
    }
  }
})

module.exports = Grade;