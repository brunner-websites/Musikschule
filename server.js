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
app.use('/addresses', require('./routes/address.route'));
app.use('/classes', require('./routes/class.route'));
app.use('/student-classes', require('./routes/student-classes.route'));
app.use('/subjects', require('./routes/subject.route'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));