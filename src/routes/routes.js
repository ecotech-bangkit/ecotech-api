const express = require('express');
const crudRouter = express.Router();
const userController = require('../controllers/userController');

crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.post('/register', userController.createNewUser);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.delete('/:id', userController.deleteUserByID);

module.exports = crudRouter;
