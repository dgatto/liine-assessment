const fs = require('fs');
const parse = require('csv-parser');

const daysToIndex = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const indexToDays = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

/**
 * @summary Takes in a datetime and returns list of restaurants open on that datetime.
 * @param date Datetime to check for open restaurants
 * @returns List of restaurants that meet datetime criteria
 */
async function getByDate(date, restaurantsObj) {
  const restaurantNames = [];

  for (restaurant of restaurantsObj) {
    const datetimeSplit = restaurant['Hours'].split(' ');

    const days = datetimeSplit[0];

    const split = days.split('-');
    const lowerDayBound = split[0];
    const upperDayBound = split[1];

    const lowerDayBoundIndex = daysToIndex[lowerDayBound];
    const upperDayBoundIndex = daysToIndex[upperDayBound];
    const requestedDayIndex = date.getDay();

    if (lowerDayBoundIndex > upperDayBoundIndex) {
      restaurantNames.push(restaurant['Restaurant Name']);
      continue;
    }

    if (
      lowerDayBoundIndex < requestedDayIndex &&
      requestedDayIndex < upperDayBoundIndex
    ) {
      return [restaurant['Restaurant Name']];
    }
  }

  return restaurantNames;
}

/**
 * @param filePath Filepath of the CSV to be parsed
 * @summary Takes a file path for a CSV and returns it's parsed output as a Promise
 * @returns Promise of the filestream parsing the CSV
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    let results = [];

    fs.createReadStream(filePath)
      .pipe(parse())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

module.exports = {
  getByDate,
  parseCSV,
};
