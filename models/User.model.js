const Sequelize = require('sequelize');
const db = require('../config/database');

const UserRole = require('./UserRole.model');
const Address = require('./Address.model');
const Class = require('./Class.model');
const StudentClasses = require('./StudentClasses.model');


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
      model: UserRole,
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
  region: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  zip: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING(50),
    allowNull: false,
  }
})

// User (*) ------- (1) UserRole
User.belongsTo(UserRole, { foreignKey: 'role_id' });
UserRole.hasMany(User, { foreignKey: 'role_id' });

// This is the 1 : Many relations-ship between Class to User (in this case the user is a teacher (defined by the role_id))
// Class.belongsTo(User, { foreignKey: 'teacher_id' });
// User.hasMany(Class, { foreignKey: 'teacher_id' });

// This is the Many : Many relations-ship between Class to User (in this case the user is a student (defined by the student_id))
// User (m) ------ StudentClasses ------ (n) Class
User.belongsToMany(Class, { through: StudentClasses, foreignKey: 'student_id', otherKey: 'class_id' });
Class.belongsToMany(User, { through: StudentClasses, foreignKey: 'class_id', otherKey: 'student_id' })

module.exports = User;