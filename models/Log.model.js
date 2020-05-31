const Sequelize = require('sequelize');
const db = require('../config/database');

const Log = db.define('logs', {
  // attributes
  // id	user_id	ip_address	method	body	requested_url	time
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.SMALLINT,
    allowNull: false
  },
  ip_address: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  method: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  body: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  requested_url: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  time: {
    type: Sequelize.DATE,
    allowNull: true
  }
})

module.exports = Log;