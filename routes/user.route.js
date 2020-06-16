const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { query, check, validationResult } = require('express-validator');
const moment = require('moment');

const User = require('../models/User.model');

const { getUserRole } = require('../utils/user.utility');


//  @route    GET    /api/v1/users
//  @desc     Get all or specific users
//  @access   Private (Can only be accessed by admin) 
//  @Query-Params:  ?role={role-id}&email={email-address}

router.get(
  '/',
  [
    query('role').escape(),
    query('email').escape(),
  ],
  async (req, res) => {

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

  });


//  @route    GET    /api/v1/users/:userID
//  @desc     Get a specific user by ID
//  @access   Private (Can only be accessed by admin and teacher) 

router.get(
  '/:id',
  [],
  async (req, res) => {

    try {

      const users = await User.findAll({ where: { id: req.params.id }, attributes: { exclude: ['password'] } });
      res.status(200).json(users);
    } catch (error) {
      console.log("error fetching user " + error);
      res.status(500).json({ msg: "Server Error" })
    }

  });


//  @route    POST    /api/v1/attendance-lists  
//  @desc     Create a new attendance entry
//  @access   Private (Can only be done by admin and teacher)    
router.post(
  '/',
  [
    // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
    check('firstName', 'first name is required').not().isEmpty(),
    check('lastName', 'first name is required').not().isEmpty(),
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
      // This will come from the req.body once authentication is implemented
      const userID = 5;

      // Get User-Role
      const userRole = await getUserRole(userID);

      // If user is not an admin return error message
      if (userRole != 'admin') {
        return res.status(400).json({ msg: "Not authorized" });
      }

      // Create new user 
      // id | first_name | last_name | email | password | role_id | birth_date | image | region | city | zip | street
      const { firstName, lastName, email, password, roleId, birthDate, image, region, city, zipCode, streetAddress } = req.body;

      // Create hashed user-password
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
//  @desc     Creating a new user
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
      const { firstName, lastName, email, password, roleId, birthDate, image, region, city, zipCode, streetAddress } = req.body;

      // Build contact object
      const userFields = {};

      if (firstName) userFields.first_name = firstName;
      if (lastName) userFields.last_name = lastName;
      if (email) userFields.email = email;
      if (password) userFields.password = password;
      if (roleId) userFields.role_id = roleId;
      if (birthDate) userFields.birth_date = birthDate;
      if (image) userFields.image = image;
      if (region) userFields.region = region;
      if (city) userFields.city = city;
      if (zipCode) userFields.zip = zipCode;
      if (streetAddress) userFields.street = streetAddress;


      const updatedUser = await User.update(
        userFields,
        {
          where: { id: req.params.id }
        }
      );

      // If the bill was updated return the updated object (sequelize for some reason doesn't return the object on updating)
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

      // 3 Delete the user

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
