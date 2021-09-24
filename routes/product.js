const express = require('express');

const router = express.Router();

//controllers
const { registerData, postRegisterData } = require('../controllers/registerData');
const { loginData, postLoginData } = require('../controllers/loginData');
const userData = require('../controllers/userData');
const { updateData, postUpdateData } = require('../controllers/updateData');
const deleteData = require('../controllers/deleteData');

//middlewares
const uploadAuth = require('../middlewares/uploadAuth');
const jwtToken = require('../middlewares/jwtToken');

router.get('/register', registerData);
router.get('/login', loginData);
router.get('/data', jwtToken, userData);
router.get('/update/:id', updateData);
router.get('/delete/:id', deleteData);

router.post('/register', uploadAuth, postRegisterData);
router.post('/login', postLoginData);
router.post('/update/:id', uploadAuth, postUpdateData);

module.exports = router;