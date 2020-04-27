const Sequelize = require('sequelize');
const db = require('../config/database');

const GradeCycle = require('../models/GradeCycle.model');
const Address = require('../models/Address.model');

const School = db.define('school', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  address_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Address,
      key: 'id'
    }
  },
  grade_cycle_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: GradeCycle,
      key: 'id'
    }
  }
})

module.exports = School;