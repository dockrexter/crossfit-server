var express = require("express");
var router = express.Router();

var userController = require("../../controllers/user.controller");
const validateEmailAndPassword = require('../../middleware/validate-email-and-password');
const firebaseAuth = require('../../middleware/firebase-auth');

app.post('/login', validateEmailAndPassword, userController.login);
app.post('/register', validateEmailAndPassword, userController.register);
app.get('/users/:id', firebaseAuth, userController.getUser);

module.exports = router;