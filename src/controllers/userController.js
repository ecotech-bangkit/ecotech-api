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

const getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserByID(id);
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
      data: user,
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
        id: user.id,
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
  const { name, email, password, repassword } = body;

  try {
    if (name.length < 2) {
      res.status(400).json({
        statusCode: 400,
        error: 'name character minimum 2 character',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        statusCode: 400,
        error: 'Invalid. Please use valid email format',
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
    if (password.length < 8) {
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
    const defaultRoleUser = 3;
    await userModel.createNewUser({
      id,
      ...body,
      password: hashedPassword,
      roleid: defaultRoleUser,
      image: '',
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
  if (!name) {
    res.status(400).json({
      statusCode: 400,
      error: 'Name field is required',
    });
    return;
  }
  if (name.length < 2) {
    res.status(400).json({
      statusCode: 400,
      error: 'name character minimum 2 character',
    });
    return;
  }
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

const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({
        statusCode: 400,
        error: 'Invalid request. Please use parameter user ID.',
      });
      return;
    }
    const user = await userModel.deleteUserByID(id);
    if (!user) {
      res.status(404).json({
        statusCode: 404,
        error: 'User not found',
      });
      return;
    }
    await userModel.deleteUserByID(id);
    res.status(200).json({
      statusCode: 200,
      message: 'User deleted successfully',
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
  getUserByID,
  createNewUser,
  updateUserByEmail,
  deleteUserByID,
};
