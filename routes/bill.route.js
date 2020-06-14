const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const Bill = require('../models/Bill.model');
const { getUserRole } = require('../utils/user.utility');
const { getCurrentSchoolYear } = require('../utils/general.utility');


//  @route    GET    /api/v1/bills  
//  @desc     Receiving one or multiple bills
//  @access   Private (Can only be done by admin) 
//  @Query-Params:  ?user={user-id}&year={year}  

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

  });


//  @route    POST    /api/v1/bills  
//  @desc     Creating a new bill
//  @access   Private (Can only be done by admin)    
router.post(
  '/',
  [
    // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
    check('billing_reason', 'billing_reason is required').not().isEmpty(),
    check('amount', 'amount is required and needs to be numeric').isNumeric(),
    check('payment_date', 'payment_date is required (YYYY-MM-DD)').not().isEmpty(),
    check('student_id', 'student_id is required and needs to be numberic').isNumeric(),
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
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Create new bill 
      // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
      const { billing_reason, amount, payment_date, student_id } = req.body;

      const bill = await Bill.create({
        billing_reason,
        amount,
        is_paid: false,
        issue_date: moment().format('YYYY-MM-DD'),
        payment_date,
        school_year: getCurrentSchoolYear(),
        student_id
      });

      console.log(bill.toJSON());
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
  [
    // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
  ],
  async (req, res) => {

    try {
      // This will come from the req.body once authentication is implemented
      const userId = 5;

      // 1 Get User-Role
      const userRole = await getUserRole(userId);

      // 2 If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Create new bill 
      // id | billing_reason | amount | is_paid | issue_date | payment_date | school_year | student_id | 
      const { billing_reason, amount, is_paid, issue_date, payment_date, student_id } = req.body;

      // Build contact object
      const billFields = {};

      if (billing_reason) billFields.billing_reason = billing_reason;
      if (amount) billFields.amount = amount;
      if (is_paid) billFields.is_paid = is_paid;
      if (issue_date) billFields.issue_date = issue_date;
      if (payment_date) billFields.payment_date = payment_date;
      if (student_id) billFields.student_id = student_id;

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
  async (req, res) => {

    try {
      // This will come from the req.body once authentication is implemented
      const userId = 5;

      // 1 Get User-Role
      const userRole = await getUserRole(userId);

      // 2 If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Delete the bill

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
