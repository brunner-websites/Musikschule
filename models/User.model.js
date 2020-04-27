const Sequelize = require('sequelize');
const db = require('../config/database');

const UserRoles = require('../models/UserRoles.model');
const Address = require('../models/Address.model');

const User = db.define('users', {
  // attributes
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  password: {
    type: Sequelize.CHAR(100),
    allowNull: false
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: UserRoles,
      key: 'id'
    }
  },
  birth_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  address_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Address,
      key: 'id'
    }
  }
})

module.exports = User;