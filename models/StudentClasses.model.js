const Sequelize = require('sequelize');
const db = require('../config/database');

const Student = require('../models/Student.model');
const Class = require('../models/Class.model');

const StudentClasses = db.define('students_classes', {
  // attributes
  student_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Student,
      key: 'id'
    }
  },
  class_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: Class,
      key: 'id'
    }
  }

})

module.exports = StudentClasses;