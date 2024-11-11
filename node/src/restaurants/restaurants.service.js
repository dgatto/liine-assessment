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

/**
 * @summary Takes in a datetime and returns list of restaurants open on that datetime.
 * @param date Datetime to check for open restaurants
 * @returns List of restaurants that meet datetime criteria
 */
async function getByDate(date, restaurantsObj) {
  const restaurantNames = [];
  const requestedDayIndex = date.getDay();

  /**
   * @summary Converts a given time into it's decimal format. ex: 11:30 -> 11.5
   * @param {string} time The time to convert
   * @param {string} modifier Whether it's an AM or PM time
   * @returns
   */
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

  /**
   * @summary Takes in the decimal time range for the hours a restaurant is open and see if the requestedTime is within bounds, taking in to account overnight openings.
   * @param {number} lowerTimeBoundAsNumber
   * @param {number} upperTimeBoundAsNumber
   * @param {number} requestedTime Decimal representation of requested time for openings.
   * @returns
   */
  function requestedTimeWithinBounds(
    lowerTimeBoundAsNumber,
    upperTimeBoundAsNumber,
    requestedTime
  ) {
    // ex: 11am-11pm
    const isWithinSameDayRange =
      lowerTimeBoundAsNumber < upperTimeBoundAsNumber &&
      requestedTime >= lowerTimeBoundAsNumber &&
      requestedTime < upperTimeBoundAsNumber;

    // ex: 10pm-12:15am
    const isWithinOvernightRange =
      lowerTimeBoundAsNumber > upperTimeBoundAsNumber &&
      (requestedTime >= lowerTimeBoundAsNumber ||
        requestedTime < upperTimeBoundAsNumber);

    // ex: 10pm-3am
    const isOpenNextDay =
      lowerTimeBoundAsNumber > upperTimeBoundAsNumber &&
      requestedTime > upperTimeBoundAsNumber;

    if (isWithinSameDayRange || isWithinOvernightRange || isOpenNextDay) {
      return true;
    }

    return false;
  }

  // Loop through each restaurant and parse their day/time to find if there is a match with the given day/time.
  for (restaurant of restaurantsObj) {
    let ranges = [];

    if (restaurant['Hours'].includes('/')) {
      let segments = restaurant['Hours'].split('/');

      ranges = segments.map((x) => x.trim());
    } else {
      ranges.push(restaurant['Hours']);
    }

    for (let i = 0; i < ranges.length; i++) {
      // Split a day/time range in to it's separate pieces (ex: Mon-Tue 11am - 5 pm)

      const datetimeSplit = ranges[i].split(' ');

      const days = datetimeSplit[0];

      const split = days.split('-');

      // Create upper/lower day and time bounds after splitting up the range.
      const lowerDayBound = split[0];
      const upperDayBound = split[split.length === 1 ? 0 : 1];

      let lowerTimeBound,
        upperTimeBound,
        individualDay,
        individualDayIndex,
        newStr;

      // Map the day name to their day index for comparison against index from `requestedDayIndex`
      // Split the times in to their individual time and modifier pieces (ex: ['11', 'am'])
      if (upperDayBound.includes(',')) {
        newStr = upperDayBound.replaceAll(',', '');

        // If we're just dealing with a range on one day, we'll call that out to check later
        individualDay = datetimeSplit[1];
        individualDayIndex = daysToIndex[individualDay];

        lowerTimeBound = [datetimeSplit[2], datetimeSplit[3]];
        upperTimeBound = [datetimeSplit[5], datetimeSplit[6]];
      } else {
        lowerTimeBound = [datetimeSplit[1], datetimeSplit[2]];
        upperTimeBound = [datetimeSplit[4], datetimeSplit[5]];
      }

      // Get indexes of day bounds from named day -> index map
      const lowerDayBoundIndex = daysToIndex[lowerDayBound];
      const upperDayBoundIndex = daysToIndex[newStr ? newStr : upperDayBound];

      // Turn time of day in to decimal format
      const lowerTimeBoundAsNumber = timeStringToDecimal(
        lowerTimeBound[0],
        lowerTimeBound[1]
      );

      const upperTimeBoundAsNumber = timeStringToDecimal(
        upperTimeBound[0],
        upperTimeBound[1]
      );

      const requestedTimeInDecimals = date.getHours() + date.getMinutes() / 60;

      // Check if the open times for the week wrap, such as "Mon-Sun". In that case, it's open every day.
      if (lowerDayBoundIndex > upperDayBoundIndex) {
        if (
          requestedTimeWithinBounds(
            lowerTimeBoundAsNumber,
            upperTimeBoundAsNumber,
            requestedTimeInDecimals
          )
        ) {
          restaurantNames.push(restaurant['Restaurant Name']);
          continue;
        }
      }

      // Check if requested day/time is within day bounds, then time bounds.
      if (
        (lowerDayBoundIndex <= requestedDayIndex &&
          requestedDayIndex <= upperDayBoundIndex) ||
        requestedDayIndex === individualDayIndex
      ) {
        if (
          requestedTimeWithinBounds(
            lowerTimeBoundAsNumber,
            upperTimeBoundAsNumber,
            requestedTimeInDecimals
          )
        ) {
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
