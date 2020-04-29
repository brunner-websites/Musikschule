const Sequelize = require('sequelize');
const db = require('../config/database');

const Class = require('../models/Class.model');
const User = require('../models/User.model');

const WeeklyNote = db.define('weekly_notes', {
  // attributes
  // id | note | class_id (FK) | student_id (FK)
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  school_year: {
    type: Sequelize.STRING(9),
    allowNull: false
  },
  class_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: 'id'
    }
  },
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
})

module.exports = WeeklyNote;