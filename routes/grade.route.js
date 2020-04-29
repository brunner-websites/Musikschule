const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade.model');
const { Op } = require('sequelize');
const { query } = require('express-validator');

// Base-Route:    /grades
// Query-Params:  ?user={user-id}&class={class-id}&school-year={year}  
router.get(
  '/',
  [
    query('user').escape(),
    query('class').escape(),
    query('year').escape()
  ],
  async (req, res) => {

    const userID = req.query.user ? req.query.user : false;
    const classID = req.query.class ? req.query.class : false;
    const schoolYear = req.query.year ? req.query.year : false;

    let whereClauses = false;

    if (userID || schoolYear || classID) {
      whereClauses = {
        where: { [Op.and]: [] }
      }
    }

    if (userID) {
      whereClauses.where[Op.and].push({ student_id: userID });
    };

    if (classID) {
      whereClauses.where[Op.and].push({ class_id: classID });
    };

    if (schoolYear) {
      whereClauses.where[Op.and].push({ school_year: schoolYear });
    };


    try {
      const grades = await Grade.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(grades);
    } catch (error) {
      console.log("error fetching grades " + error);
    }

  })

module.exports = router;
