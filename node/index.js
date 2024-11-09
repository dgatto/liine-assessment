const express = require('express');
const http = require('http');
const port = 3000;

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

server.listen(port, () => {
  console.log(`⚡️ Server running at http://localhost:${port}`);
});
