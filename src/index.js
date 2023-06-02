require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const connection = require('./configs/database');
const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const getEmailUsers = async () => {
  const [rows] = await connection.execute('SELECT email FROM users');
  return rows.map((row) => row.email);
};

app.post('/v1/users/register', async (req, res) => {
  const { name, email, password, repassword } = req.body;
  try {
    const emailUsers = await getEmailUsers();
    if (emailUsers.includes(email)) {
      res.status(400).json({
        statusCode: 400,
        error: 'Email already registered',
      });
      return;
    }
    if (password !== repassword) {
      res.status(400).json({
        statusCode: 400,
        error: 'Passwords do not match',
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const [result] = await connection.execute('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [id, name, email, hashedPassword]);

    res.status(201).json({
      statusCode: 201,
      message: 'Registration successful',
      data: {
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`App successfully run in ${DB_HOST}:${PORT}`);
});
