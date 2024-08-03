require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const middlewareLog = require('./middlewares/logger');
const { crudRouter, authRouter, routerML, noAuth } = require('./routes/routes');
const session = require('express-session');
const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(middlewareLog);
app.use(express.json());
app.use(
  session({
    secret: JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/v1/users/', crudRouter);
app.use('/v1/auth/', authRouter);
app.use('/v1/predict/', routerML);
app.use('/v1/', noAuth)

app.disable('etag')
app.get('/', (req, res) => {
  res.status(200).send('Response Success!');
});

app.listen(PORT || 8000, () => {
  console.log(`App successfully run in ${DB_HOST}:${PORT}`);
});

module.exports = app
