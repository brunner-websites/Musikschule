const Sequelize = require('sequelize');
const config = require('config');

const dbName = config.get('dbConfig.dbName');
const username = config.get('dbConfig.username');
const password = config.get('dbConfig.password');
const host = config.get('dbConfig.host');


// Connect to DB
const db = new Sequelize(dbName, username, password, {
  host: host,
  dialect: 'mysql',
  timezone: '+02:00',   // Set timezone to Madrid ECT
  define: {
    freezeTableName: true,
    timestamps: false
  }
});


module.exports = db;