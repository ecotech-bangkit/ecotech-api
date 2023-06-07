const express = require('express');
const crudRouter = express.Router();
const authRouter = express.Router();
const routerML = express.Router();
const loadModel = require('../models/mlModels');
const userController = require('../controllers/userController');
const needAuthorization = require('../middlewares/auth');

crudRouter.use(needAuthorization);
crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.put('/changepassword/:email', userController.updateUserPasswordByEmail);
crudRouter.delete('/:id', userController.deleteUserByID);

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);
authRouter.post('/logout', needAuthorization, userController.logout);

module.exports = { crudRouter, authRouter };
