const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User.model');


const UserRole = db.define('user_roles', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  }

});

module.exports = UserRole;