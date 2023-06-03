require('dotenv').config();

const express = require('express');
const middlewareLog = require('./middlewares/logger');
const router = require('./routes/routes');
const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const app = express();
app.use(middlewareLog);
app.use(express.json());

app.use('/v1/users/register', router);

app.listen(PORT, () => {
  console.log(`App successfully run in ${DB_HOST}:${PORT}`);
});
