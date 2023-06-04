const express = require('express');
const crudRouter = express.Router();
const authRouter = express.Router();
const userController = require('../controllers/userController');

crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.delete('/:id', userController.deleteUserByID);

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);

module.exports = { crudRouter, authRouter };
