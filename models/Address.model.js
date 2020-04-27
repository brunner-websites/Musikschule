const Sequelize = require('sequelize');
const db = require('../config/database');

const Address = db.define('addresses', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  region: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  zip: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING(50),
    allowNull: false,
  }
})

module.exports = Address;