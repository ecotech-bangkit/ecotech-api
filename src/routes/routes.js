const express = require('express');
const crudRouter = express.Router();
const authRouter = express.Router();
const userController = require('../controllers/userController');
const needAuthorization = require('../middlewares/auth');

crudRouter.get('/', needAuthorization, userController.getAllUsers);
crudRouter.get('/:email', needAuthorization, userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.delete('/:id', needAuthorization, userController.deleteUserByID);

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);
authRouter.post('/logout', needAuthorization, userController.logout);

module.exports = { crudRouter, authRouter };
