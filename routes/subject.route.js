const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject.model');

router.get('/', (req, res) => {

  Subject.findAll()
    .then(subjects => {
      res.status(200).json(subjects);
    })
    .catch(err => console.log("error fetching subjects"));
})

module.exports = router;
