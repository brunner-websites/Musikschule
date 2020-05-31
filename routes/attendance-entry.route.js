const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const AttendanceEntry = require('../models/AttendanceEntry.model');

const { getCurrentSchoolYear } = require('../utils/general.utility');


//  @route    GET    /api/v1/attendance-lists  
//  @desc     Get one or multiple attendance-lists
//  @access   Private (Can only be done by admin and teacher) 
//  @Query-Params:  ?student={user-id}&class={class-id}&year={year}&month={month}

router.get(
  '/',
  [
    query('student').escape(),
    query('class').escape(),
    query('year').escape(),
    query('month').escape()
  ],
  async (req, res) => {

    const userId = req.query.student ? req.query.student : false;
    const classId = req.query.class ? req.query.class : false;
    const schoolYear = req.query.year ? req.query.year : false;
    const month = req.query.month ? req.query.month : false;

    let whereClauses = false;

    if (userId || classId || schoolYear || month) {
      whereClauses = {
        where: { [Op.and]: [] }
      }
    }

    if (userId) {
      whereClauses.where[Op.and].push({ student_id: userId });
    };

    if (classId) {
      whereClauses.where[Op.and].push({ class_id: classId });
    };

    if (schoolYear) {
      whereClauses.where[Op.and].push({ school_year: schoolYear });
    };

    if (month) {
      whereClauses.where[Op.and].push({ month: month });
    };

    try {
      const attendanceEntries = await AttendanceEntry.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(attendanceEntries);
    } catch (error) {
      console.log("error fetching attendance-lists " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/attendance-lists  
//  @desc     Create a new attendance entry
//  @access   Private (Can only be done by admin and teacher)    
router.post(
  '/',
  [
    // 	id | school_year | month | date | has_attended | student_id | class_id
    check('month', 'month of entry is required').not().isEmpty(),
    check('date', 'amount is required and needs to be numeric').not().isEmpty(),
    check('student_id', 'student_id is required and needs to be numberic').isNumeric(),
    check('class_id', 'class_id is required and needs to be numberic').isNumeric(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will come from the req.body once authentication is implemented
      const userID = 5;

      // 1 Get User-Role
      const userRole = await getUserRole(userID);

      // 2 If user is not an admin return error message
      if (userRole != 'admin' || userRole != 'teacher') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Create new attendance entry 
      // 	id | school_year | month | date | has_attended | student_id | class_id
      const { month, date, student_id, class_id } = req.body;

      const newAttendanceEntryObj = {
        month,
        date,
        student_id,
        class_id
      }

      if (req.body.school_year) {
        newAttendanceEntryObj.school_year = req.body.school_year;
      } else {
        newAttendanceEntryObj.school_year = getCurrentSchoolYear();
      }

      if (req.body.has_attended) {
        newAttendanceEntryObj = req.body.has_attended;
      }

      const attendanceEntry = await AttendanceEntry.create({
        newAttendanceEntryObj
      });

      console.log(attendanceEntry.toJSON());
      return res.status(200).json(attendanceEntry);

    } catch (error) {
      console.error("Error creating bill: " + error);
      return res.status(500).json({ msg: "Server Error " + error });
    }

  });


//  @route    PUT    /api/v1/bills/:id  
//  @desc     Creating a new bill
//  @access   Private (Can only be done by admin)    
router.put(
  '/:id',
  [
    // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
  ],
  async (req, res) => {

    try {


    } catch (error) {
      console.error("Error updating bill: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });


//  @route    DELETE    /api/v1/bills/:id  
//  @desc     Deleting a bill
//  @access   Private (Can only be done by admin)    
router.delete(
  '/:id',
  async (req, res) => {

    try {

      return res.status(200);

    } catch (error) {
      console.error("Error deleting bill: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });

module.exports = router;
