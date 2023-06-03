const connection = require('../configs/database');

const getAllUsers = () => {
  const query = 'SELECT * FROM users';
  return connection.execute(query);
};
const createNewUser = (body) => {
  const query = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
  const values = [body.id, body.name, body.email, body.password];
  return connection.execute(query, values);
};
const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [user] = await connection.execute(query, [email]);
  return user;
};
const updateUserByEmail = (email, { name }) => {
  const query = 'UPDATE users SET name = ? WHERE email = ?';
  const values = [name, email];
  return connection.execute(query, values);
};
const deleteUserByEmail = (email) => {
  const query = 'DELETE FROM users WHERE email = ?';
  return connection.execute(query, [email]);
};
module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
};
