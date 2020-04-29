const Sequelize = require('sequelize');
const db = require('../config/database');

const Subject = require('../models/Subject.model');
const User = require('../models/User.model');

const Class = db.define('classes', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  start_time: {
    type: Sequelize.TIME,
    allowNull: false
  },
  end_time: {
    type: Sequelize.TIME,
    allowNull: false
  },
  school_year: {
    type: Sequelize.STRING(9),
    allowNull: false
  },
  weekday: {
    type: Sequelize.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'),
    allowNull: false
  },
  subject_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Subject,
      key: 'id'
    }
  },
  teacher_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }

})

module.exports = Class;