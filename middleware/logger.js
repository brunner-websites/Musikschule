const moment = require('moment');

const Log = require('../models/Log.model');

// create simple middleware
const logger = async (req, res, next) => {

  // this will come from the auth.middleware
  //const userId = req.user.id;
  const userId = 1;
  const ipAddress = req.connection.remoteAddress;

  const method = req.method;
  const body = JSON.stringify(req.body);
  const requestedUrl = req.originalUrl;
  const time = moment().format();

  try {

    const log = await Log.create({
      // attributes
      // id |	user_id |	ip_address | method |	body |	requested_url |	time
      user_id: userId,
      ip_address: ipAddress,
      method,
      body,
      requested_url: requestedUrl,
      time
    });

  } catch (error) {
    console.error("Error creating log: " + error);
  }

  console.log(userId, ipAddress, method, body, requestedUrl, time);
  //console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}, ${moment().format()}`);
  next();
}

module.exports = logger;