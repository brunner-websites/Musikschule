const express = require('express');
const router = express.Router();
const StudentClasses = require('../models/StudentClasses.model');

router.get('/', (req, res) => {

  StudentClasses.findAll()
    .then(studentClasses => {
      res.status(200).json(studentClasses);
    })
    .catch(err => console.log("error fetching StudentClasses"));
})

module.exports = router;
