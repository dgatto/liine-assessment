const express = require('express');
const getByDate = require('./restaurants.service');
const app = (module.exports = express());

app.get('/restaurants/open-by-date/:date', async (req, res) => {
  const date = req.params.date;

  const results = await getByDate(date);

  res.send(results);
});
