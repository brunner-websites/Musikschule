const express = require('express');
const router = express.Router();
const Student = require('../models/Student.model');

router.get('/', (req, res) => {

  Student.findAll()
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => console.log("error fetching students"));
})

module.exports = router;
