const Sequelize = require('sequelize');
const db = require('../config/database');

const GradeCycle = db.define('grade_cycles', {
  // attributes
  // id | cycle (e.g.: month/trimester/quarter/semester)

  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  cylce: {
    type: Sequelize.STRING(20),
    allowNull: false
  }
})

module.exports = GradeCycle;