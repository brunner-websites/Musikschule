const express = require('express');
const router = express.Router();
const Class = require('../models/Class.model');

router.get('/', (req, res) => {

  Class.findAll()
    .then(classes => {
      res.status(200).json(classes);
    })
    .catch(err => console.log("error fetching classes"));
})

module.exports = router;
