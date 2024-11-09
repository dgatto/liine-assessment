const express = require('express');
const getByDate = require('./restaurants.service');
const app = (module.exports = express());

app.get('/restaurants/open-by-date/:date', async (req, res) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const date = req.params.date;

  const results = await getByDate(date);

  /*
    take in date range
    loop through all results

    edit:


    identify ranges of current iteration on restaurants (for example, how will we know that thursday is inclded on mon-fri (anything to avoid regex))
        example input: 2024-11-09T05:51:39Z
        bit jank, but: identify day of date input (say, saturday)
                        identify range of restaurant hours (ex: Fri-Sat) 

        less jank: lets first transform each datetime and open range in to a number for easier comparision using Day.getDate();



    put names in list
    return list
  */

  res.send(results);
});
