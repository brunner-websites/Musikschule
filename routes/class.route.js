const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const Class = require('../models/Class.model');
const { getUserRole } = require('../utils/user.utility');
const { getCurrentSchoolYear } = require('../utils/general.utility');


//  @route    GET    /api/v1/classes  
//  @desc     Get one or multiple classes
//  @access   Private (Can only be done by admin and teacher) 
//  @Query-Params:  ?&year={year}&teacher={user-id}&weekday={weekday}

router.get(
  '/',
  [
    query('teacher').escape(),
    query('year').escape(),
    query('weekday').escape()
  ],
  async (req, res) => {

    const teacherId = req.query.teacher ? req.query.teacher : false;
    const schoolYear = req.query.year ? req.query.year : false;
    const weekday = req.query.weekday ? req.query.weekday : false;

    let whereClauses = false;

    if (teacherId || schoolYear || weekday) {
      whereClauses = {
        where: { [Op.and]: [] }
      }
    }

    if (teacherId) {
      whereClauses.where[Op.and].push({ teacher_id: teacherId });
    };

    if (schoolYear) {
      whereClauses.where[Op.and].push({ school_year: schoolYear });
    };

    if (weekday) {
      whereClauses.where[Op.and].push({ weekday: weekday });
    };


    try {
      const classes = await Class.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(classes);
    } catch (error) {
      console.log("error fetching classes " + error);
    }

  });


//  @route    GET    /api/v1/classes/:classID
//  @desc     Get a specific class by ID
//  @access   Private (Can only be accessed by admin and teacher) 

router.get(
  '/:id',
  [],
  async (req, res) => {

    try {

      const classes = await Class.findAll({ where: { id: req.params.id } });
      res.status(200).json(classes);
    } catch (error) {
      console.log("error fetching class " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/bills  
//  @desc     Creating a new bill
//  @access   Private (Can only be done by admin)    
router.post(
  '/',
  [
    // id | name | start_time | end_time | school_year | weekday | subject_id | teacher_id | 
    check('name', 'name is required').not().isEmpty(),
    check('schoolYear', 'schoolYear is required and needs to be numeric').not().isEmpty(),
    check('teacherId', 'teacher_id is required and needs to be numberic').isNumeric(),
    check('subjectId', 'subject_id is required and needs to be numberic').isNumeric(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // This will come from the req.body once authentication is implemented
      const userID = 5;

      // Get User-Role
      const userRole = await getUserRole(userID);

      // If user is not an admin or teacher return error message
      if (!(userRole == 'admin' || userRole == 'teacher')) {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Create new class 
      // id | name | start_time | end_time | school_year | weekday | subject_id | teacher_id | 
      const { name, startTime, endTime, schoolYear, weekday, subjectId, teacherId } = req.body;

      const newClass = await Class.create({
        name,
        start_time: startTime,
        end_time: endTime,
        school_year: schoolYear,
        weekday,
        subject_id: subjectId,
        teacher_id: teacherId
      });

      return res.status(200).json(newClass);

    } catch (error) {
      console.error("Error creating class: " + error);
      return res.status(500).json({ msg: "Server Error " + error });
    }

  });


//  @route    PUT    /api/v1/classes/:id  
//  @desc     Update an existing class
//  @access   Private (Can only be done by admin)    
router.put(
  '/:id',
  [
    // id | name | start_time | end_time | school_year | weekday | subject_id | teacher_id | 
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
  ],
  async (req, res) => {

    try {
      // This will come from the req.body once authentication is implemented
      const userId = 5;

      // 1 Get User-Role
      const userRole = await getUserRole(userId);

      // 2 If user is not an admin or teacher return error message
      if (!(userRole == 'admin' || userRole == 'teacher')) {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Create new bill 
      // id | name | start_time | end_time | school_year | weekday | subject_id | teacher_id | 
      const { name, startTime, endTime, schoolYear, weekday, subjectId, teacherId } = req.body;

      // Build contact object
      const classFields = {};

      if (name) classFields.name = name;
      if (startTime) classFields.start_time = startTime;
      if (endTime) classFields.end_time = endTime;
      if (schoolYear) classFields.school_year = schoolYear;
      if (weekday) classFields.weekday = weekday;
      if (subjectId) classFields.subject_id = subjectId;
      if (teacherId) classFields.teacher_id = teacherId;

      const updatedClass = await Class.update(
        classFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the bill was updated return the updated object (sequelize for some reason doesn't return the object on updating)
      if (updatedClass[0] == 1) {
        const bill = await Class.findByPk(req.params.id);
        return res.status(200).json(bill);
      }

      return res.status(404).json({ msg: 'Resource not found' });

    } catch (error) {
      console.error("Error updating bill: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });


//  @route    DELETE    /api/v1/classes/:id  
//  @desc     Deleting a class
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
      const deletedClass = await Class.destroy(
        {
          where: { id: req.params.id }
        }
      );


      res.status(200).json({ msg: "request completed", rowsDeleted: deletedClass });;

    } catch (error) {
      console.error("Error deleting class: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });

module.exports = router;
