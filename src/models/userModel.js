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
const createNewUserKolektor = (body) => {
  const query = 'INSERT INTO users (id, name, alamat, nohp, email, password, roleid) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [body.id, body.name, body.alamat, body.nohp, body.email, body.password, body.roleid];
  return connection.execute(query, values);
};
const createOrderEwaste = (body) => {
  const query = 'INSERT INTO penyetoran (penyetor_id, kolektor_id, item_image, status) VALUES (?,?,?,?)'
  const values = [body.penyetor_id, body.kolektor_id, body.item_image, body.status]
  return connection.execute(query, values)
}
const getUserByID = async (id) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const [user] = await connection.execute(query, [id]);
  return user[0];
};
const getAllUsersKolektor = async (roleid) =>{
  const query = 'SELECT id, name, alamat, nohp, roleid FROM users WHERE roleid = ?';
  const [user] = await connection.execute(query,[roleid])
  return [user];
}
const getAllUsersPenyetor = async (roleid) =>{
  const query = 'SELECT id, name, alamat, nohp, roleid FROM users WHERE roleid = ?';
  const [user] = await connection.execute(query,[roleid])
  return [user];
}
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [user] = await connection.execute(query, [email]);
  return user;
};
const getAllOrderEwaste = async () => {
  const query = 'SELECT * FROM penyetoran'
  return await connection.execute(query)
}
const getOrderEwasteByID = async (id) => {
  const query = 'SELECT * FROM penyetoran WHERE id = ? '
  const [values]= await connection.execute(query, [id])
  return values[0]
}
const getOrderEwasteByStatus = async (status) => {
  const query = 'SELECT * FROM penyetoran WHERE status = ? '
  const values = await connection.execute(query, [status])
  return values
}
const getOrderEwasteByKolektorIdAndStatusMenunggu = async (kolektor_id) => {
  const query = 'SELECT penyetoran.id, penyetoran.penyetor_id, users.name AS penyetor_name, item_image, status, created_at FROM penyetoran INNER JOIN users on users.id = penyetoran.penyetor_id WHERE status = ? AND kolektor_id = ?'
  const[rows] = await connection.execute(query, ['Menunggu', kolektor_id])
  return [rows]
}
const getAllStatusOrderEwasteByKolektorId = async (kolektor_id) => {
  const query = 'SELECT penyetoran.id, penyetoran.penyetor_id, users.name AS penyetor_name, item_image, status, created_at FROM penyetoran INNER JOIN users on users.id = penyetoran.penyetor_id WHERE kolektor_id = ?'
  const[rows] = await connection.execute(query, [kolektor_id])
  return [rows]
} 
const getAllStatusOrderEwasteByPenyetorId = async (penyetor_id) => {
  const query = 'SELECT penyetoran.id, penyetoran.kolektor_id, users.name AS kolektor_name, users.alamat, users.nohp, item_image, status, created_at FROM penyetoran INNER JOIN users on users.id = penyetoran.kolektor_id WHERE penyetoran.penyetor_id = ?';
  const[rows] = await connection.execute(query, [penyetor_id])
  return [rows]
} 
const updateStatusOrderEwaste = (id, {status}) => {
  const query = 'UPDATE penyetoran SET status = ? WHERE id = ?';
  const values = [status, id]
  return connection.execute(query, values);
}
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
  createNewUserKolektor,
  createOrderEwaste,
  getAllOrderEwaste,
  getOrderEwasteByID,
  getUserByEmail,
  getUserByID,
  getAllUsersKolektor,
  getAllUsersPenyetor,
  getOrderEwasteByStatus,
  getOrderEwasteByKolektorIdAndStatusMenunggu,
  getAllStatusOrderEwasteByKolektorId,
  getAllStatusOrderEwasteByPenyetorId,
  updateStatusOrderEwaste,
  updateUserByEmail,
  updatePhotoProfileByEmail,
  updateUserPasswordByEmail,
  deleteUserByID,
  logout,
  updateUserTokenByEmail,
};
