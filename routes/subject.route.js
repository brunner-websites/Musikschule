const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const Subject = require('../models/Subject.model');

const { getUserRole } = require('../utils/user.utility');


//  @route    GET    /api/v1/subjects
//  @desc     Get all subjects
//  @access   Private (Can only be accessed by admin) 
//  @Query-Params:  ?name={subject-name}

router.get(
  '/',
  [
    query('name').escape(),
  ],
  async (req, res) => {

    const subjectName = req.query.name ? req.query.name : false;

    let whereClauses = false;

    if (subjectName) {
      whereClauses = {
        where: {
          name: {
            [Op.substring]: subjectName
          }
        }
      }
    }

    try {

      const subjects = await Subject.findAll(whereClauses ? whereClauses : undefined);
      res.status(200).json(subjects);
    } catch (error) {
      console.log("error fetching subjects " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });

//  @route    GET    /api/v1/subjects/:subjectID
//  @desc     Get a specific subject by ID
//  @access   Private (Can only be accessed by admin) 

router.get(
  '/:id',
  [],
  async (req, res) => {

    try {

      const subjects = await Subject.findAll({ where: { id: req.params.id } });
      res.status(200).json(subjects);
    } catch (error) {
      console.log("error fetching subjects " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/subjects  
//  @desc     Create a new subject
//  @access   Private (Can only be accessed by admin)    
router.post(
  '/',
  [
    // id | name
    check('name', 'name (of subject) is required').not().isEmpty()
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
      // id | name
      const { name } = req.body;

      const subject = await Subject.create({ name });

      console.log(subject.toJSON());
      return res.status(200).json(subject);

    } catch (error) {
      console.error("Error creating subject: " + error);
      return res.status(500).json({ msg: "Server Error " + error });
    }
  });


//  @route    PUT    /api/v1/subjects/:id  
//  @desc     Update a subject
//  @access   Private (Can only be accessed by admin)    
router.put(
  '/:id',
  [],
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

      // 3 Update an existing user 
      // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
      const { name } = req.body;

      // Build contact object
      const subjectFields = {};

      if (name) subjectFields.name = name;

      const updatedSubject = await Subject.update(
        subjectFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the bill was updated return the updated object (sequelize for some reason doesn't return the object on updating)
      if (updatedSubject[0] == 1) {
        const subject = await Subject.findByPk(req.params.id);
        return res.status(200).json(subject);
      }

      return res.status(404).json({ msg: 'Resource not found' });

    } catch (error) {
      console.error("Error updating subject: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });



//  @route    DELETE    /api/v1/subjects/:id  
//  @desc     Delete a subject
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

      const deletedSubject = await Subject.destroy(
        {
          where: { id: req.params.id }
        }
      );

      return res.status(200);

    } catch (error) {
      console.error("Error deleting subject: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });

module.exports = router;
