const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher.model');

router.get('/', (req, res) => {

  Teacher.findAll()
    .then(teachers => {
      res.status(200).json(teachers);
    })
    .catch(err => console.log("error fetching teachers"));
})

module.exports = router;
