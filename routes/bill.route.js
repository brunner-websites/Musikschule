const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill.model');
const { Op } = require('sequelize');
const { query } = require('express-validator');

// Base-Route:    /bills
// Query-Params:  ?user={user-id}&school-year={year}  
router.get(
  '/',
  [
    query('user').escape(),
    query('year').escape()
  ],
  async (req, res) => {

    const userID = req.query.user ? req.query.user : false;
    const schoolYear = req.query.year ? req.query.year : false;

    let whereClauses = false;

    if (userID || schoolYear) {
      whereClauses = {
        where: { [Op.and]: [] }
      }
    }

    if (userID) {
      whereClauses.where[Op.and].push({ student_id: userID });
    };

    if (schoolYear) {
      whereClauses.where[Op.and].push({ school_year: schoolYear });
    };


    try {
      const bills = await Bill.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(bills);
    } catch (error) {
      console.log("error fetching addresses " + error);
    }

  })

module.exports = router;
