const express = require('express');
const router = express.Router();
const Address = require('../models/Address.model');

router.get('/', (req, res) => {

  Address.findAll()
    .then(addresses => {
      res.status(200).json(addresses);
    })
    .catch(err => console.log("error fetching addresses"));
})

module.exports = router;
