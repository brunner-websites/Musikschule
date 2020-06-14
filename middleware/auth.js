const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied' });
  }

  try {

    // Decode the jwt token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // If jwt.verify succeeds then save the user in request.user
    req.user = decoded.user;

    next();

  } catch (error) {
    // If jwt.verify fails
    res.status(401).json({ msg: 'Token is not valid' });
  }
}