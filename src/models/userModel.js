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
const updatePhotoProfileByEmail = (email, { image }) => {
  const query = 'UPDATE users SET image = ? WHERE email = ?';
  const values = [image || null, email];
  return connection.execute(query, values);
};
const updateUserPasswordByEmail = (email, password) => {
  const query = 'UPDATE users SET password = ? WHERE email = ?';
  const values = [password, email];
  return connection.execute(query, values);
};
const deleteUserByID = (id) => {
  const query = 'DELETE FROM users WHERE id = ?';
  return connection.execute(query, [id]);
};
const logout = async (userId) => {
  const query = 'UPDATE users SET token = NULL WHERE id = ?';
  await connection.execute(query, [userId]);
};
const updateUserTokenByEmail = (email, token) => {
  const query = 'UPDATE users SET token = ? WHERE email = ?';
  const values = [token, email];
  return connection.execute(query, values);
};
module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
  getUserByID,
  updateUserByEmail,
  updatePhotoProfileByEmail,
  updateUserPasswordByEmail,
  deleteUserByID,
  logout,
  updateUserTokenByEmail,
};
