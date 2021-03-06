const Sequelize = require('sequelize');
const db = require('../config/database');

const User = require('./User.model');
const Class = require('./Class.model');


const AttendanceEntry = db.define('attendance_entries', {
  // attributes
  // id | date | has_attended | student_id | class_id
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  school_year: {
    type: Sequelize.STRING(9),
    allowNull: false
  },
  month: {
    type: Sequelize.INTEGER(2),
    allowNull: false
  },
  has_attended: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  class_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: 'id'
    }
  }
})


// AttendanceList (*) ------- (1) User
AttendanceEntry.belongsTo(User, { foreignKey: 'student_id' });
User.hasMany(AttendanceEntry, { foreignKey: 'student_id' });

// AttendanceList (*) ------- (1) Class
AttendanceEntry.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(AttendanceEntry, { foreignKey: 'class_id' });


module.exports = AttendanceEntry;