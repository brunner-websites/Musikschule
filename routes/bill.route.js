const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const Bill = require('../models/Bill.model');
const { getUserRole } = require('../utils/user.utility');
const { getCurrentSchoolYear } = require('../utils/general.utility');
const auth = require('../middleware/auth');


//  @route    GET    /api/v1/bills  
//  @desc     Receiving one or multiple bills
//  @access   Private (Can only be done by admin) 
//  @Query-Params:  ?student={user-id}&year={year}  

router.get(
  '/',
  auth,
  [
    query('student').escape(),
    query('year').escape()
  ],
  async (req, res) => {

    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClauses = false;

    // Admin can request any bill he want
    if (userRole == 'admin') {
      const userID = req.query.student ? req.query.student : false;
      const schoolYear = req.query.year ? req.query.year : false;

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
    }
    // student can only see his own bills
    else if (userRole == 'student') {
      whereClauses = {
        where: { student_id: userId }
      }
    } else {
      return res.status(401).json({ msg: 'Authorization denied' });
    }


    try {
      const bills = await Bill.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(bills);
    } catch (error) {
      console.log("error fetching addresses " + error);
    }

  });


//  @route    GET    /api/v1/bills/:billId
//  @desc     Get a specific bill by ID
//  @access   Private (Can only be accessed by admin and student) 

router.get(
  '/:id',
  auth,
  [],
  async (req, res) => {

    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = null;

    if (userRole == 'admin') {
      whereClause = { where: { id: req.params.id } };
    } else if (userRole == 'student') {
      whereClause = {
        where: {
          [Op.and]: [
            { id: req.params.id },
            { student_id: userId }
          ]
        }
      }
    } else {
      return res.status(401).json({ msg: 'Authorization denied' });
    }

    try {

      const bills = await Bill.findAll(whereClause);
      res.status(200).json(bills);
    } catch (error) {
      console.log("error fetching bill " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/bills  
//  @desc     Creating a new bill
//  @access   Private (Can only accessed by admin)    
router.post(
  '/',
  auth,
  [
    // id | billing_reason | amount | is_paid | issue_date | due_date | payment_date | school_year | student_id | 
    check('billingReason', 'billingReason is required').not().isEmpty(),
    check('amount', 'amount is required and needs to be numeric').isNumeric(),
    check('studentId', 'studentId is required and needs to be numberic').isNumeric(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(401).json({ msg: "Not authorized" });
      }

      // Create new bill 
      // id | billing_reason | amount | is_paid | issue_date | due_date | payment_date | school_year | student_id | 
      const { billingReason, amount, paymentDate, dueDate, studentId } = req.body;

      const bill = await Bill.create({
        billing_reason: billingReason,
        amount,
        is_paid: false,
        issue_date: moment().format('YYYY-MM-DD'),
        due_date: dueDate ? dueDate : null,
        payment_date: paymentDate ? paymentDate : null,
        school_year: getCurrentSchoolYear(),
        student_id: studentId
      });

      return res.status(200).json(bill);

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
  auth,
  [
    // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
  ],
  async (req, res) => {

    try {
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(401).json({ msg: "Not authorized" });
      }

      // Create new bill 
      // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
      const { billingReason, amount, isPaid, issueDate, dueDate, paymentDate, schoolYear,
        studentId } = req.body;

      // Build contact object
      const billFields = {};

      if (billingReason) billFields.billing_reason = billingReason;
      if (amount) billFields.amount = amount;
      if (isPaid) billFields.is_paid = isPaid;
      if (issueDate) billFields.issue_date = issueDate;
      if (dueDate) billFields.due_date = dueDate;
      if (paymentDate) billFields.payment_date = paymentDate;
      if (schoolYear) billFields.school_year = schoolYear;
      if (studentId) billFields.student_id = studentId;

      const updatedBill = await Bill.update(
        billFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the bill was updated return the updated object (sequelize for some reason doesn't return the object on updating)
      if (updatedBill[0] == 1) {
        const bill = await Bill.findByPk(req.params.id);
        return res.status(200).json(bill);
      }

      return res.status(404).json({ msg: 'Resource not found' });

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
  auth,
  async (req, res) => {

    try {
      // This comes from the auth middleware
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Delete the bill
      const deletedBill = await Bill.destroy(
        {
          where: { id: req.params.id }
        }
      );


      res.status(200).json({ msg: "request completed", rowsDeleted: deletedBill });;

    } catch (error) {
      console.error("Error deleting bill: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });

module.exports = router;
