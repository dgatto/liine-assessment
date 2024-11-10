const express = require('express');
const { getByDate, parseCSV } = require('./restaurants.service.js');
const app = (module.exports = express());
const path = require('path');

/**
 * @summary Takes in a datetime and returns list of restaurants open on that datetime
 * @param date Datetime to check for open restaurants. Assumed that the client is passing the date in the ISO-8601 format
 * @returns List of restaurants that meet datetime criteria
 * @
 */
app.get('/restaurants/open-by-date/:date', async (req, res) => {
  const date = new Date(req.params.date);

  const filePath = path.resolve(__dirname, './restaurants.csv');

  const restaurants = await parseCSV(filePath);

  const results = await getByDate(date, restaurants);

  /*
    take in date range
    loop through all results

    edit:


    identify ranges of current iteration on restaurants (for example, how will we know that thursday is inclded on mon-fri (anything to avoid regex))
        example input: 2024-11-09T05:51:39Z
        bit jank, but: identify day of date input (say, saturday)
                        identify range of restaurant hours (ex: 2pm - 5pm) 

        less jank: lets first transform each datetime and open range in to a number for easier comparision using Day.getDate();
        
        get Date.getDay() based on input day (Wed -> 4)
        Get date range for restaurants in loop based on `daysToIndex` map (Tues-Thurs -> 3-5)
        see if given date is within range for the restaurant (if 4 > 3 && 4 < 5) return name
        !! how to account for the date wrapping to the next week? // Mon - Sun would be 0 and 1. If I ask for Tuesday, tuesday is b/w Mon-Sun, but 3 does not fit the 1-0 bound.
            do i have to have a special use case for just that situation? it's not neccwssarily an edge case, since there are a lot of instances of it. but it doesn't follow the same logic flow. how can we delineate?
                we can see if the lowerbound is greater than the upper bound. ex: Mon-Sun would be 1-0. 
                if lowerbound is greater (at least by 1) that indicates that the open times are every day of the week.
                then we just have to look at time. 

        how can i parse the day/time without using regex?

        // if i can assume the format of the data will always yield "['Mon-Sun', '11', 'am', '-', '12', 'am']", i could use those indexes to identify a range

        // should i translate all times to 24 hour clock for easier time checks?

        // several cases

        const date = new Date(paramDate); // Wednesday

        const requestedDay = date.getDay(); // 4

        for restaurant in restaurants {
            const ranges = restaurant.hours.split('/'); // get each of the datetime pairs

            let names = [];
            for range in ranges { // Mon-Sun 11 am - 12 am  

                // need to compensate for when a range has a comma, ex: 'Mon-Tues, Thu 11 am - 5 pm'

                const checkCommaSplit = range.split(','); // ['Mon-Tues', ' Thu, 11 am - 12 am' ]
                if (checkCommaSplit.length > 1) {
                    // do stuff for this use case
                    continue;
                }



                const splits = range.split(' '); // ['Mon-Sun', '11', 'am', '-', '12', 'am']
                const daySplit = splits[0].split('-'); // ['Mon', 'Sun']
                if daySplit.length === 1 // only one day on set; ex: 'Sat 11 pm - 12 am'
                
                const lowerBound = daysToIndex[daySplit[0]] // Mon -> 1
                const upperBound = daysToIndex[daySplit[1]] // Sun -> 0
                
                if (lowerBound > upperBound) { // i.e. open every day of the week
                    // get time range and check if within time
                    if providedTime within open time {
                        names.push(name)
                        continue;
                    }
                }

                if (lowerBound < requestedDay < upperBound) {
                    if providedTime within open time {
                        names.push(name)
                        continue;
                    }

                }
            }            
        }

        god i hope i'm not overcomplicating this ;-;

        
    put names in list
    return list
  */

  res.send(results);
});
