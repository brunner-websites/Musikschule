const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const moment = require('moment');
const { query, check, validationResult } = require('express-validator');

const Grade = require('../models/Grade.model');

const { getCurrentSchoolYear } = require('../utils/general.utility');
const { getUserRole } = require('../utils/user.utility');

//  @route    GET    /api/v1/grades  
//  @desc     Get one or multiple grades
//  @access   Private (Can only be done by admin and teacher) 
//  @Query-Params:  ?student={user-id}&class={class-id}&school-year={year}  
router.get(
  '/',
  [
    query('student').escape(),
    query('class').escape(),
    query('year').escape()
  ],
  async (req, res) => {

    // This will come from the req.body once authentication is implemented
    const userID = 5;

    // Get User-Role
    const userRole = await getUserRole(userID);

    // TODO: If the user is a student he can only see his own grades
    /*
    if (!(userRole == 'admin' || userRole == 'teacher')) {
      return res.status(400).json({ msg: "Not authorized" });
    }
    */

    const studentId = req.query.student ? req.query.student : false;
    const classId = req.query.class ? req.query.class : false;
    const schoolYear = req.query.year ? req.query.year : false;

    let whereClauses = false;

    if (studentId || schoolYear || classId) {
      whereClauses = {
        where: { [Op.and]: [] },
        attributes: { exclude: ['time_updated'] }
      }
    }

    if (studentId) {
      whereClauses.where[Op.and].push({ student_id: studentId });
    };

    if (classId) {
      whereClauses.where[Op.and].push({ class_id: classId });
    };

    if (schoolYear) {
      whereClauses.where[Op.and].push({ school_year: schoolYear });
    };


    try {
      const grades = await Grade.findAll(whereClauses ? whereClauses :
        {
          attributes: { exclude: ['time_updated'] }
        });
      res.status(200).json(grades);
    } catch (error) {
      console.log("error fetching grades " + error);
    }

  })


//  @route    GET    /api/v1/grades/:gradeID
//  @desc     Get a specific grade by ID
//  @access   Private (Can only be accessed by admin and teacher) 

router.get(
  '/:id',
  [],
  async (req, res) => {

    try {
      const classes = await Grade.findAll({ where: { id: req.params.id }, attributes: { exclude: ['time_updated'] } });
      res.status(200).json(classes);
    } catch (error) {
      console.log("error fetching grade " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/grades  
//  @desc     Create a new grade
//  @access   Private (Can only be done by admin or teacher)    
router.post(
  '/',
  [
    // id | grade | school_year | time_taken | student_id | class_id
    check('grade', 'grade is required and needs to be numeric').isNumeric(),
    check('studentId', 'studentId is required and needs to be numeric').isNumeric(),
    check('classId', 'classId is required and needs to be numeric').isNumeric(),
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

      // Create new grade 
      // id | grade | school_year | time_taken | student_id | class_id
      const { grade, schoolYear, studentId, classId } = req.body;

      const newGrade = await Grade.create({
        grade,
        time_taken: moment().format(),
        school_year: schoolYear ? schoolYear : getCurrentSchoolYear(),
        student_id: studentId,
        class_id: classId
      });

      return res.status(200).json(newGrade);

    } catch (error) {
      console.error("Error creating grade: " + error);
      return res.status(500).json({ msg: "Server Error " + error });
    }

  });


//  @route    PUT    /api/v1/grades/:id  
//  @desc     Update an existing grade
//  @access   Private (Can only be done by admin or teacher)    
router.put(
  '/:id',
  [
    // id | grade | school_year | time_taken | time_updated | student_id | class_id
    // check('billing_reason', 'billing_reason is required').not().isEmpty(),
  ],
  async (req, res) => {

    try {
      // This will come from the req.body once authentication is implemented
      const userId = 5;

      // Get User-Role
      const userRole = await getUserRole(userId);

      // If user is not an admin or teacher return error message
      if (!(userRole == 'admin' || userRole == 'teacher')) {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Create new bill 
      // id | grade | school_year | time_taken | time_updated | student_id | class_id
      const { grade, schoolYear, studentId, classId } = req.body;

      // Build contact object
      const gradeFields = {};

      if (grade) gradeFields.grade = grade;
      if (schoolYear) gradeFields.school_year = schoolYear;
      if (studentId) gradeFields.student_id = studentId;
      if (classId) gradeFields.class_id = classId;

      gradeFields.time_updated = moment().format();

      const updatedGrade = await Grade.update(
        gradeFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the grade was updated return the updated object (sequelize for some reason doesn't return the object on updating)
      if (updatedGrade[0] == 1) {
        const grade = await Grade.findByPk(req.params.id);
        return res.status(200).json(grade);
      }

      return res.status(404).json({ msg: 'Resource not found' });

    } catch (error) {
      console.error("Error updating grade: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });


//  @route    DELETE    /api/v1/grades/:id  
//  @desc     Deleting a grade
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
      if (!(userRole == 'admin' || userRole == 'teacher')) {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // 3 Delete the bill
      const deletedGrade = await Grade.destroy(
        {
          where: { id: req.params.id }
        }
      );


      res.status(200).json({ msg: "request completed", rowsDeleted: deletedGrade });;

    } catch (error) {
      console.error("Error deleting grade: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });
module.exports = router;
