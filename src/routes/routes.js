const express = require('express');
const multer = require('multer');
const crudRouter = express.Router();
const authRouter = express.Router();
const routerML = express.Router();
const userController = require('../controllers/userController');
const mlController = require('../controllers/mlController');
const needAuthorization = require('../middlewares/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);
authRouter.post('/logout', needAuthorization.authenticateToken, userController.logout);

crudRouter.use(needAuthorization.authenticateToken);
crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.put('/changepassword/:email', userController.updateUserPasswordByEmail);
crudRouter.delete('/removeuser/:id', userController.deleteUserByID);
crudRouter.post('/uploadphoto/:email', upload.single('image'), userController.uploadProfilePhoto);

routerML.post('/', upload.single('image'), mlController.predict);

module.exports = { crudRouter, authRouter, routerML };
