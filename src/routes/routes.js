const express = require('express');
const crudRouter = express.Router();
const userController = require('../controllers/userController');

crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.post('/register', userController.createNewUser);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.delete('/:email', userController.deleteUserByEmail);

module.exports = crudRouter;
