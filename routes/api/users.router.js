var express = require("express");
var router = express.Router();

var userController = require("../../controllers/user.controller");
const validateEmailAndPassword = require('../../middleware/validate-email-and-password');
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/login', validateEmailAndPassword, userController.login);
router.post('/register', validateEmailAndPassword, userController.register);
router.get('/:id', firebaseAuth, userController.getUser);
router.get('/getAllusers', firebaseAuth, userController.getAllUsers);

module.exports = router;