const express = require('express');
const app = (module.exports = express());

app.get('/restaurants/open-by-date/:date', (req, res) => {
  const date = req.params.date;
});
