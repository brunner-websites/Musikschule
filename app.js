const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const db = require('./config/database');

db
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.'); })
  .catch(err => { console.error('Unable to connect to the database:', err); });

const app = express();

// Init Middleware (allow to send and receive JSON data)
app.use(express.json({ extended: false }));


app.get('/', (req, res) => {
  res.send("INDEX");
})

// Routes
app.use('/students', require('./routes/student.route'));
app.use('/classes', require('./routes/class.route'));
app.use('/subjects', require('./routes/subject.route'));
app.use('/teachers', require('./routes/teacher.route'));
app.use('/student-classes', require('./routes/student-classes.route'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `Server started on port ${PORT}`);