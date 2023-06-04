const express = require('express');
const crudRouter = express.Router();
const authRouter = express.Router();
const userController = require('../controllers/userController');
const needAuthenticate = require('../middlewares/auth');

crudRouter.get('/', needAuthenticate, userController.getAllUsers);
crudRouter.get('/:email', needAuthenticate, userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.delete('/:id', needAuthenticate, userController.deleteUserByID);

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);

module.exports = { crudRouter, authRouter };
