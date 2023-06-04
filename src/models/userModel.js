const connection = require('../configs/database');

const getAllUsers = () => {
  const query = 'SELECT * FROM users';
  return connection.execute(query);
};
const createNewUser = (body) => {
  const query = 'INSERT INTO users (id, name, email, password, roleid) VALUES (?, ?, ?, ?, ?)';
  const values = [body.id, body.name, body.email, body.password, body.roleid];
  return connection.execute(query, values);
};
const getUserByID = async (id) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [user] = await connection.execute(query, [id]);
  return user[0];
};
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [user] = await connection.execute(query, [email]);
  return user;
};
const updateUserByEmail = (email, { name }) => {
  const query = 'UPDATE users SET name = ? WHERE email = ?';
  const values = [name, email];
  return connection.execute(query, values);
};
const deleteUserByID = (id) => {
  const query = 'DELETE FROM users WHERE id = ?';
  return connection.execute(query, [id]);
};
module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
  getUserByID,
  updateUserByEmail,
  deleteUserByID,
};
