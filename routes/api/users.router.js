var express = require("express");
var router = express.Router();

var userController = require("../../controllers/user.controller");
const validateEmailAndPassword = require('../../middleware/validate-email-and-password');
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/login', validateEmailAndPassword, userController.login);
router.post('/deleteUser', validateEmailAndPassword, userController.deleteUser);
router.post('/register', validateEmailAndPassword, firebaseAuth, userController.register);
router.post('/getUser', firebaseAuth, userController.getUser);
router.get('/getAllUsers', firebaseAuth, userController.getAllUsers);

module.exports = router;