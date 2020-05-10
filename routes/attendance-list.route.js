const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const AttendanceList = require('../models/AttendanceList.model');

//  @route    GET    /api/v1/attendance-lists  
//  @desc     Get one or multiple attendance-lists
//  @access   Private (Can only be done by admin) 
//  @Query-Params:  ?user={user-id}&school-year={year}  

router.get(
  '/',
  [
    query('user').escape(),
    query('class').escape()
  ],
  async (req, res) => {

    const userId = req.query.user ? req.query.user : false;
    const classId = req.query.class ? req.query.class : false;

    let whereClauses = false;

    if (userId || classId) {
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


    try {
      const attendanceLists = await AttendanceList.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(attendanceLists);
    } catch (error) {
      console.log("error fetching attendance-lists " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/bills  
//  @desc     Creating a new bill
//  @access   Private (Can only be done by admin)    
router.post(
  '/',
  [
    // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
    // check('amount', 'amount is required and needs to be numeric').isNumeric(),
    // check('payment_date', 'payment_date is required (YYYY-MM-DD)').not().isEmpty(),
    // check('student_id', 'student_id is required and needs to be numberic').isNumeric(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {


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
