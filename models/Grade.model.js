const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('../models/User.model');
const Class = require('../models/Class.model');

const Grade = db.define('grades', {
  // attributes
  // id | grade | year | nth_grade | student_id (FK) | class_id (FK)

  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  grade: {
    type: Sequelize.TINYINT(4),
    allowNull: false
  },
  school_year: {
    type: Sequelize.STRING(9),
    allowNull: false
  },
  nth_grade: {
    type: Sequelize.TINYINT(4),
    allowNull: false
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