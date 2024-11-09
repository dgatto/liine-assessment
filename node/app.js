const express = require('express');
const http = require('http');
const port = 3000;

const app = express();
const server = http.createServer(app);

const restaurants = require('./src/restaurants/restaurants.index');
app.use(restaurants);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

server.listen(port, () => {
  console.log(`⚡️ Server running at http://localhost:${port}`);
});
