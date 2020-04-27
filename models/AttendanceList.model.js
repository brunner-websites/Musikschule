const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('./User.model');
const Class = require('./Class.model');


const AttendanceList = db.define('attendance_lists', {
  // attributes
  // id | date | has_attended | student_id | class_id
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  has_attended: {
    type: Sequelize.BOOLEAN,
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

module.exports = AttendanceList;