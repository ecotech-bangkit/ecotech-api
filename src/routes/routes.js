const express = require('express');
const multer = require('multer');
const crudRouter = express.Router();
const authRouter = express.Router();
const routerML = express.Router();
const userController = require('../controllers/userController');
const mlController = require('../controllers/mlController');
const needAuthorization = require('../middlewares/auth');
const ImgUpload = require('../modules/imgUpload');

// Konfigurasi Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasan ukuran file 5MB
  },
});

authRouter.post('/register', userController.createNewUser);
authRouter.post('/login', userController.login);
authRouter.post('/logout', userController.logout);

crudRouter.use(needAuthorization);
crudRouter.get('/', userController.getAllUsers);
crudRouter.get('/:email', userController.getUserByEmail);
crudRouter.get('/id/:id', userController.getUserByID);
crudRouter.put('/:email', userController.updateUserByEmail);
crudRouter.put('/changepassword/:email', userController.updateUserPasswordByEmail);
crudRouter.delete('/:id', userController.deleteUserByID);
crudRouter.post('/uploadphoto/:email', upload.single('file'), userController.uploadProfilePhoto);

routerML.post('/', upload.single('image'), ImgUpload.uploadToGcs, mlController.predict);

module.exports = { crudRouter, authRouter, routerML };
