const express = require('express');
const multer = require('multer');
const crudRouter = express.Router();
const authRouter = express.Router();
const routerML = express.Router();
const noAuth = express.Router();
const userController = require('../controllers/userController');
const mlController = require('../controllers/mlController');
const needAuthorization = require('../middlewares/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

noAuth.get('/',userController.getAllUsers);
noAuth.get('/kolektor', userController.getAllKolektor);
noAuth.get('/penyetor', userController.getAllPenyetor);
noAuth.get('/orders', userController.getAllOrderEwaste);
noAuth.get('/orders/:id', userController.getOrderEwasteByID);
noAuth.get('/orders/status/query/:status', userController.getOrderEwasteByStatus);
noAuth.get('/orders/status/id/menunggu', userController.getOrderEwasteByKolektorIdAndStatusMenunggu);
noAuth.get('/orders/status/id/kolektor/all', userController.getAllStatusOrderEwasteByKolektorId)
noAuth.get('/orders/status/id/penyetor/all', userController.getAllStatusOrderEwasteByPenyetorId)
noAuth.put('/setor/accept/:id', userController.updateStatusOrderEwasteAccepted);
noAuth.put('/setor/reject/:id', userController.updateStatusOrderEwasteRejected);
noAuth.put('/setor/finish/:id', userController.updateStatusOrderEwasteFinished);

authRouter.post('/register', userController.createNewUser);
authRouter.post('/registerkolektor', userController.createNewUserKolektor);
authRouter.post('/submitewaste', upload.single('image'),userController.createOrderEwaste);
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

module.exports = { crudRouter, authRouter, routerML, noAuth };
