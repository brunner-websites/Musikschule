const Sequelize = require('sequelize');
const db = require('../config/database');

const Subject = require('../models/Subject.model');
const Teacher = require('../models/Teacher.model');

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
      model: Teacher,
      key: 'id'
    }
  }

})

module.exports = Class;