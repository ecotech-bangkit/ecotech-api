require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const connection = require('./configs/database');
const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.post('/v1/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const [result] = await connection.execute('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [id, name, email, hashedPassword]);
    res.status(201).json({
      message: 'Registration successful',
      data: req.body,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`App successfully run in ${DB_HOST}:${PORT}`);
});
