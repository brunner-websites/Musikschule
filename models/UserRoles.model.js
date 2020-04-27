const Sequelize = require('sequelize');
const db = require('../config/database');


const UserRoles = db.define('user_roles', {
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

module.exports = UserRoles;