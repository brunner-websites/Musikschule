const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const auth = require('../middleware/auth');
const User = require('../models/User.model');
const Class = require('../models/Class.model');
const { getUserRole } = require('../utils/user.utility');
const { getCurrentSchoolYear } = require('../utils/general.utility');


//  @route    GET    /api/v1/users
//  @desc     Get all or specific users
//  @access   Private (Can only be accessed by admin) 
//  @Query-Params:  ?role={role-id}&email={email-address}

router.get(
  '/',
  auth,
  [
    query('role').escape(),
    query('email').escape(),
  ],
  async (req, res) => {

    const userRole = req.user.role;

    // The admin can request all users or query them by 'role' or 'email'
    if (userRole == 'admin') {

      const roleId = req.query.role ? req.query.role : false;
      const email = req.query.email ? req.query.email : false;

      let whereClauses = false;

      if (roleId || email) {
        whereClauses = {
          where: { [Op.and]: [] },
          attributes: { exclude: ['password'] }
        }
      }

      if (roleId) {
        whereClauses.where[Op.and].push({ role_id: roleId });
      };

      if (email) {
        whereClauses.where[Op.and].push({ email: email });
      };

      try {
        const users = await User.findAll(
          whereClauses ? whereClauses : {
            attributes: { exclude: ['password'] }
          }
        );
        res.status(200).json(users);
      } catch (error) {
        console.log("error fetching users " + error);
        res.status(500).json({ msg: "Server Error" })
      }
    }
    // the teacher will get a list of their classes with their students
    else if (userRole == 'teacher') {

      const userId = req.user.id;
      const currentSchoolYear = getCurrentSchoolYear();

      try {
        const classesWithStudentsFromTeacher = await Class.findAll({
          where: {
            teacher_id: userId,
            school_year: currentSchoolYear
          },
          required: true,
          attributes: { exclude: ['id', 'subject_id', 'teacher_id'] },

          // This will make a JOIN
          include: [
            {
              model: User,
              attributes: { exclude: ['id', 'password', 'region', 'city', 'zip', 'street', 'role_id', 'birth_date'] }
            }
          ]
        });

        return res.status(200).json(classesWithStudentsFromTeacher);

      } catch (error) {
        console.log("error fetching users " + error);
        res.status(500).json({ msg: "Server Error" })
      }
    }
  });


//  @route    GET    /api/v1/users/:userID
//  @desc     Get a specific user by ID
//  @access   Private (Can only be accessed by admin) 

router.get(
  '/:id',
  auth,
  [],
  async (req, res) => {

    const userRole = req.user.role;
    const userId = req.user.id;

    try {
      if (userRole == 'admin' || userRole == 'teacher') {
        const users = await User.findAll({ where: { id: req.params.id }, attributes: { exclude: ['password'] } });
        res.status(200).json(users);
      } else {

      }

    } catch (error) {
      console.log("error fetching user " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/users  
//  @desc     Create a new user
//  @access   Private (Can only be done by admin)    
router.post(
  '/',
  auth,
  [
    // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
    check('firstName', 'firstName is required').not().isEmpty(),
    check('lastName', 'lastName is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password is required and needs to have at least 6 characters').isLength({ min: 6 }),
    check('roleId', 'roleId is required and needs to be numberic').isNumeric(),
    check('birthDate', 'birthDate is required').not().isEmpty(),
    check('city', 'city is required').not().isEmpty(),
    check('zipCode', 'zipCode is required').not().isEmpty(),
    check('streetAddress', 'streetAddress is required').not().isEmpty(),
    check('region', 'region is required').not().isEmpty(),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      // This req.user is saved/created by the 'auth' middleware
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Create new user 
      // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
      const { firstName, lastName, email, password, roleId, birthDate, image, region, city, zipCode, streetAddress } = req.body;

      // Hash user-password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role_id: roleId,
        birth_date: birthDate,
        image,
        region,
        city,
        zip: zipCode,
        street: streetAddress
      });

      return res.status(200).json(user);

    } catch (error) {
      console.error("Error creating user: " + error);
      return res.status(500).json({ msg: "Server Error " + error });
    }
  });


//  @route    PUT    /api/v1/users/:id  
//  @desc     Updating a specific user
//  @access   Private (Can only be accessed by admin)    
router.put(
  '/:id',
  auth,
  [],
  async (req, res) => {

    try {
      // This req.user is saved/created by the 'auth' middleware
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Update an existing user 
      // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
      const { firstName, lastName, email, password, roleId, birthDate, image, region, city, zipCode, streetAddress } = req.body;

      // Build contact object
      const userFields = {};

      if (firstName) userFields.first_name = firstName;
      if (lastName) userFields.last_name = lastName;
      if (email) userFields.email = email;
      if (roleId) userFields.role_id = roleId;
      if (birthDate) userFields.birth_date = birthDate;
      if (image) userFields.image = image;
      if (region) userFields.region = region;
      if (city) userFields.city = city;
      if (zipCode) userFields.zip = zipCode;
      if (streetAddress) userFields.street = streetAddress;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        userFields.password = hashedPassword;
      }


      const updatedUser = await User.update(
        userFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the user was updated return the updated object (sequelize for some reason doesn't return the object on updating)
      if (updatedUser[0] == 1) {
        const user = await User.findByPk(req.params.id);
        return res.status(200).json(user);
      }

      return res.status(404).json({ msg: 'Resource not found' });

    } catch (error) {
      console.error("Error updating user: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });



//  @route    DELETE    /api/v1/users/:id  
//  @desc     Deleting a user
//  @access   Private (Can only be done by admin)    
router.delete(
  '/:id',
  auth,
  async (req, res) => {

    try {
      // This req.user is saved/created by the 'auth' middleware
      const userRole = req.user.role;

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Delete the user
      const deletedUser = await User.destroy(
        {
          where: { id: req.params.id }
        }
      );

      res.status(200).json({ msg: "request completed", rowsDeleted: deletedUser });;

    } catch (error) {
      console.error("Error deleting user: " + error);
      return res.status(500).json({ msg: "Server Error " });
    }

  });

module.exports = router;
