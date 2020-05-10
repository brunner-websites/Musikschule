const User = require('../models/User.model');
const UserRole = require('../models/UserRole.model');

async function getUserRole(userID) {

  try {
    const user = await User.findOne({
      where: {
        id: userID
      },
      include: UserRole,
      required: true,
      attributes: { exclude: ['password'] }
    });

    if (user) {
      return user.user_role.role;
    } else {
      return null;
    }


  } catch (error) {
    console.log("Error Fetching User Role (getUserRole) " + error);
    return false;
  }
}


module.exports = {
  getUserRole: getUserRole
};