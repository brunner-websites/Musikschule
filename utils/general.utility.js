var moment = require('moment');

// Returns the current school year in the format yyyy-yyyy (e.g. 2019-2020)
// If we're before September the current school year is gonna be 'year-before'-'current-year'
// If we're after September the current school year is gonna be 'current-year'-'year-after'
function getCurrentSchoolYear() {

  const now = moment();

  if (now.month() < 9) {
    const yearBefore = now.year() - 1;
    return yearBefore + "-" + now.year();
  } else {
    const yearAfter = now.year() + 1;
    return now.year() + '-' + yearAfter;
  }
}


module.exports = {
  getCurrentSchoolYear: getCurrentSchoolYear
};