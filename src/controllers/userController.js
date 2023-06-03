const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const getAllUsers = async (req, res) => {
  try {
    const data = await userModel.getAllUsers();
    res.json({
      message: 'GET all user success',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: res.status(),
      message: 'Internal server error',
      serverMessage: error,
    });
  }
};

const createNewUser = async (req, res) => {
  const { body } = req;
  const { password, repassword } = body;
  try {
    const isRegisteredEmail = await userModel.getUserByEmail(body.email);
    if (isRegisteredEmail) {
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
    await userModel.createNewUser({
      id,
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });
    await userModel.createNewUser(body);
    res.status(201).json({
      statusCode: res.status(),
      message: 'Registration successful',
      data: {
        id: id,
        name: body.name,
        email: body.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
    });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
};
