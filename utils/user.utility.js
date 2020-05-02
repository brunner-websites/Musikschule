const User = require('../models/User.model');
const UserRole = require('../models/UserRole.model');


// get a list of classes
// if the user-id belongs to a teacher it will return a list of every student
async function getClasses(userID) {
  try {
    const classes = await User.findOne({
      where: {
        id: userID
      },
      include: Class, // this will work because User and Class are in a ManyToMany Relationship (defined in User.model.js)
      required: true,
      attributes: { exclude: ['password', 'email', 'role_id', 'birth_date', 'image', 'address_id'] }
    });

    return classes;

  } catch (error) {
    console.log("error fetching classes " + error);
  }
}


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

    return user.user_role;

  } catch (error) {
    console.log("error fetching grades " + error);
  }
}


module.exports = {
  getUserRole: getUserRole
};