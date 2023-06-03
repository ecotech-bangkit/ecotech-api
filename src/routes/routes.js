const express = require('express');
const crudRouter = express.Router();
const userController = require('../controllers/userController');

crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.post('/register', userController.createNewUser);
crudRouter.put('/users/:email', userController.updateUserByEmail);
crudRouter.delete('/users/:email', userController.deleteUserByEmail);

module.exports = crudRouter;
