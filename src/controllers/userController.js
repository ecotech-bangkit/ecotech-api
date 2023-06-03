const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const connection = require('../configs/database');

const getAllUsers = async (req, res) => {
  try {
    const [data] = await userModel.getAllUsers();
    res.json({
      message: 'GET all user success',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      serverMessage: error,
    });
  }
};
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User retrieved successfully',
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      errorMessage: error,
    });
  }
};

const createNewUser = async (req, res) => {
  const { body } = req;
  const { password, repassword } = body;

  try {
    if (password !== repassword) {
      res.status(400).json({
        statusCode: 400,
        error: 'Passwords do not match',
      });
      return;
    }
    if (password.length < 7 || repassword.length < 7) {
      res.status(400).json({
        statusCode: 400,
        error: 'Password character at least 8',
      });
      return;
    }
    const [registeredEmail] = await connection.execute('SELECT email FROM users');
    const isEmailRegistered = registeredEmail.some((user) => user.email === body.email);
    if (isEmailRegistered) {
      res.status(400).json({
        statusCode: 400,
        error: 'Email already registered',
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await userModel.createNewUser({
      id,
      ...body,
      password: hashedPassword,
    });
    res.status(201).json({
      statusCode: 201,
      message: 'Registration successful',
      data: {
        id,
        name: body.name,
        email: body.email,
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
};

const updateUserByEmail = async (req, res) => {
  const { email } = req.params;
  const { name } = req.body;
  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    await userModel.updateUserByEmail(email, { name });
    res.json({
      statusCode: 200,
      message: 'User updated successfully',
      data: {
        name,
        email,
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

const deleteUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [user] = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    await userModel.deleteUserByEmail(email);
    res.json({
      statusCode: 200,
      message: 'User deleted successfully',
      data: {
        name: user.name,
        email: user.email,
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
  getUserByEmail,
  createNewUser,
  updateUserByEmail,
  deleteUserByEmail,
};
