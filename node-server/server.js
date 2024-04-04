const express = require('express');
const app = express();
const port = 3001; //
const connect = require('./db/db');

let dbConnection;

(async () => {
  try {
    dbConnection = await connect();
  } catch (error) {
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
  res.send('TEST SERVER');

  
});

app.listen(port, () => {
  console.log(`Server works on port ${port}`);
});