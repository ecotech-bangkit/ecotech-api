const connection = require('../configs/database');

const getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  const [rows] = await connection.execute(query);
  return rows;
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await connection.execute(query, [email]);
  return rows.length > 0;
};

const createNewUser = async (body) => {
  const { id, name, email, password } = body;
  const query = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
  const values = [id, name, email, password];
  await connection.execute(query, values);
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  createNewUser,
};
