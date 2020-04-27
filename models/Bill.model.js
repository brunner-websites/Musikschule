const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('../models/User.model');

const Bill = db.define('bills', {
  // attributes
  // id | billing_reason | amount | is_paid | issue_date | payment_date | student_id (FK --> users.id)
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  billing_reason: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  amout: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  is_paid: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  issue_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  payment_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
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

module.exports = Class;