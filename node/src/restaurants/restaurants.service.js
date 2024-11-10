const fs = require('fs');
const parse = require('csv-parser');
const path = require('path');

/**
 * @summary Takes in a datetime and returns list of restaurants open on that datetime.
 * @param date Datetime to check for open restaurants
 * @returns List of restaurants that meet datetime criteria
 */
async function getByDate(date) {
  const filePath = path.resolve(__dirname, './restaurants.csv');

  const results = await parseCSV(filePath);

  return true;

  //   for (restaurant of results) {
  //     for ()
  //       console.log(restaurant['Restaurant Name']);
  //       console.log(restaurant.Hours);
  //   }

  //   //   console.log(results);

  return results;
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
};
