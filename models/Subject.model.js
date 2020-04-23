const Sequelize = require('sequelize');
const db = require('../config/database');

const Subject = db.define('subjects', {
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
  }

})

module.exports = Subject;