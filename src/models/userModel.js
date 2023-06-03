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

module.exports = {
  getAllUsers,
  createNewUser,
};
