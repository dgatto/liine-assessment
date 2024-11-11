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
  // Would it have just been easier to turn everything in to a Date and use that class to compare their epoch instances? I still would have a lot of string manipulation logic either way.
  function timeStringToDecimal(time, modifier) {
    let [hours, minutes] = time.split(':').map(Number); // Convert hours and minutes to numbers

    // Convert to 24-hour format if necessary
    if (modifier === 'pm' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'am' && hours === 12) {
      hours = 0;
    }

    let decimalTime;

    // Calculate decimal time
    if (minutes) {
      decimalTime = hours + minutes / 60;
    } else {
      decimalTime = hours;
    }

    return decimalTime;
  }
  let restaurantNames = [];

  for (restaurant of restaurantsObj) {
    let ranges = [];
    if (restaurant['Hours'].includes('/')) {
      let r = restaurant['Hours'].split('/');

      ranges = r.map((x) => x.trim());
    } else {
      ranges.push(restaurant['Hours']);
    }

    for (let i = 0; i < ranges.length; i++) {
      const datetimeSplit = ranges[i].split(' ');

      const days = datetimeSplit[0];

      const split = days.split('-');

      const lowerDayBound = split[0];
      const upperDayBound = split[split.length === 1 ? 0 : 1];

      let lowerTimeBound,
        upperTimeBound,
        individualDay,
        individualDayIndex,
        newStr;

      if (upperDayBound.includes(',')) {
        newStr = upperDayBound.replaceAll(',', '');
        individualDay = datetimeSplit[1];
        individualDayIndex = daysToIndex[individualDay];

        lowerTimeBound = [datetimeSplit[2], datetimeSplit[3]];
        upperTimeBound = [datetimeSplit[5], datetimeSplit[6]];
      } else {
        lowerTimeBound = [datetimeSplit[1], datetimeSplit[2]];
        upperTimeBound = [datetimeSplit[4], datetimeSplit[5]];
      }

      const lowerDayBoundIndex = daysToIndex[lowerDayBound];
      const upperDayBoundIndex = daysToIndex[newStr ? newStr : upperDayBound];
      const requestedDayIndex = date.getDay();

      if (lowerDayBoundIndex > upperDayBoundIndex) {
        restaurantNames.push(restaurant['Restaurant Name']);
        continue;
      }

      if (
        (lowerDayBoundIndex <= requestedDayIndex &&
          requestedDayIndex <= upperDayBoundIndex) ||
        requestedDayIndex === individualDayIndex
      ) {
        const lowerTimeBoundAsNumber = timeStringToDecimal(
          lowerTimeBound[0],
          lowerTimeBound[1]
        );

        const upperTimeBoundAsNumber = timeStringToDecimal(
          upperTimeBound[0],
          upperTimeBound[1]
        );

        const requestedTime = date.getHours() + date.getMinutes() / 60;

        const isWithinSameDayRange =
          lowerTimeBoundAsNumber < upperTimeBoundAsNumber &&
          requestedTime >= lowerTimeBoundAsNumber &&
          requestedTime < upperTimeBoundAsNumber;

        const isWithinOvernightRange =
          lowerTimeBoundAsNumber > upperTimeBoundAsNumber &&
          (requestedTime >= lowerTimeBoundAsNumber ||
            requestedTime < upperTimeBoundAsNumber);

        const isOpenNextDay =
          lowerTimeBoundAsNumber > upperTimeBoundAsNumber &&
          requestedTime > upperTimeBoundAsNumber;

        if (isWithinSameDayRange || isWithinOvernightRange || isOpenNextDay) {
          restaurantNames.push(restaurant['Restaurant Name']);
          continue;
        }
      }
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
