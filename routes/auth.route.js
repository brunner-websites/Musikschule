const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const { check, validationResult } = require('express-validator');
const User = require('../models/User.model');
const { getUserRole } = require('../utils/user.utility');


//  @route    GET    /api/v1/auth
//  @desc     Get logged in user
//  @access   Private    

// passing 'auth' as the second parameter uses the middleware (middleware/auth)
router.get('/', auth, async (req, res) => {
  try {
    // This req.'user' object is set in the middleware/auth.js 
    const user = await User.findAll({ where: { id: req.user.id }, attributes: { exclude: ['password'] } });

    res.json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


//  @route    POST    /api/v1/auth
//  @desc     Auth user & get token
//  @access   Public    
router.post('/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please provide a password').exists()
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Send response (webtoken) / Create webtoken (jwt)

      // This payload will be part of the jwt-token (its contents can be read by jwt.verify)
      const userRole = await getUserRole(user.id);

      const payload = {
        user: {
          id: user.id,
          role: userRole
        }
      }

      // Create the jwt token
      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: config.get('jwtExpireTime'),
      }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }

  });

module.exports = router;