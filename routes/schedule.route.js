const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Class = require('../models/Class.model');
const UserRole = require('../models/UserRole.model');
var moment = require('moment');

const { getUserRole } = require('../utils/user.utility');
const { getCurrentSchoolYear } = require('../utils/general.utility');

const { Op } = require('sequelize');
const { query } = require('express-validator');

// Base-Route:    /schedule
// Returns the weekly schedule 
// If the requesting user is a STUDENT it will return all the CLASSES of the student
// if the requesting user is a TEACHER it will return all the CLASSES of all the STUDENTS
router.get(
  '/',
  async (req, res) => {

    // The user id will come from the request object (but only after implementing authentication)
    // For now we will use static user ids (1,2=student), (3,4=teacher), (5=admin)
    // const userID = req.user.id;
    const userID = 3;

    try {

      // 1 Get User-Role
      const userRole = await getUserRole(userID);

      // 2 Depending if user is a teacher or a student 
      // Teacher: Get all the CLASSES (with the students attached to the classes)
      // Student: Get all the CLASSES
      let classes = null;

      if (userRole != null) {

        switch (userRole) {
          case 'teacher':
            classes = await getClassesForTeacher(userID);
            break;
          case 'student':
            classes = await getClassesForStudent(userID);
            break;
          default:
            return res.status(404).json({ msg: `No action defined for user role '${userRole.role}'` })
        }

        return res.status(200).json(classes);

      } else {
        return res.status(404).json({ msg: 'No User with this ID' });
      }

    } catch (error) {
      console.log("error fetching schedule " + error);
    }

  }
);

async function getClassesForTeacher(userID) {

  const currentSchoolYear = getCurrentSchoolYear();

  try {
    const classesFromTeacher = await Class.findAll({
      where: {
        teacher_id: userID,
        school_year: currentSchoolYear
      },
      required: true,
      attributes: { exclude: ['subject_id', 'teacher_id', 'school_year'] },
      // This will make a JOIN
      include: [
        {
          model: User,
          attributes: { exclude: ['password', 'role_id', 'birth_date', 'address_id', 'image', 'email'] }
        }
      ]
    });

    // Format Response
    let events = { MONDAY: [], TUESDAY: [], WEDNESDAY: [], THURSDAY: [], FRIDAY: [] };

    classesFromTeacher.forEach(item => {

      let jsonItem = item.toJSON();

      event = getEventObject(jsonItem);

      events[jsonItem.weekday].push(event);
    });

    return events;

  } catch (error) {
    console.log("error fetching schedule for teacher >>" + error);
  }
}


async function getClassesForStudent(studentId) {

  const currentSchoolYear = getCurrentSchoolYear();

  try {
    const studentWithClasses = await User.findOne({
      where: {
        id: studentId
      },
      required: true,
      attributes: { exclude: ['password', 'email', 'role_id', 'birth_date', 'image', 'address_id'] },
      include: [
        {
          model: Class,
          where: {
            school_year: currentSchoolYear
          },
          attributes: { exclude: ['subject_id', 'teacher_id', 'school_year'] }
        }
      ]
    });

    // Format Response
    let classes = studentWithClasses.toJSON().classes;
    let events = { MONDAY: [], TUESDAY: [], WEDNESDAY: [], THURSDAY: [], FRIDAY: [] };

    classes.forEach(item => {

      event = getEventObject(item);

      events[item.weekday].push(event);
    });

    return events;

  } catch (error) {
    console.log("error fetching schedule for student >> " + error);
  }
}

function getEventObject(item, eventType = 'custom') {

  event = {};
  event.id = item.id;
  event.name = item.name;
  event.startTime = moment.utc(item.start_time, 'hh-mm-ss');
  event.endTime = moment.utc(item.end_time, 'hh-mm-ss');
  event.type = eventType;

  return event;
}


module.exports = router;
