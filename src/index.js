require('dotenv').config();

const express = require('express');
const app = express();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

app.listen(DB_PORT, () => {
  console.log(`App successfully run in ${DB_HOST}:${DB_PORT}`);
});
