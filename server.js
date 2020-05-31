const express = require('express');
const bodyparser = require('body-parser');
const logger = require('./middleware/logger');
const path = require('path');
const db = require('./config/database');

db
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.'); })
  .catch(err => { console.error('Unable to connect to the database:', err); });

const app = express();

// Init Middleware (allow to send and receive JSON data)
app.use(express.json({ extended: false }));


// Logger middleware
app.use(logger);


app.get('/', (req, res) => {
  res.send("INDEX");
})

// Routes
// app.use('/api/v1/addresses', require('./routes/address.route'));
// app.use('/api/v1/student-classes', require('./routes/student-classes.route'));
app.use('/api/v1/attendance-entries', require('./routes/attendance-entry.route'));
app.use('/api/v1/bills', require('./routes/bill.route'));
app.use('/api/v1/schedule', require('./routes/schedule.route'));
app.use('/api/v1/classes', require('./routes/class.route'));
app.use('/api/v1/grades', require('./routes/grade.route'));
app.use('/api/v1/subjects', require('./routes/subject.route'));
app.use('/api/v1/users', require('./routes/user.route'));
app.use('/api/v1/weekly-notes', require('./routes/weekly-note.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));