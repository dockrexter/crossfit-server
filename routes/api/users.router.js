var express = require("express");
var router = express.Router();

var userController = require("../../controllers/user.controller");
const validateEmailAndPassword = require('../../middleware/validate-email-and-password');
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/login', validateEmailAndPassword, userController.login);
router.post('/deleteUser', firebaseAuth, userController.deleteUser);
router.post('/updateUser', firebaseAuth, userController.updateUser);
router.post('/register', validateEmailAndPassword, firebaseAuth, userController.register);
router.post('/getUser', firebaseAuth, userController.getUser);
router.get('/getAllUsers', firebaseAuth, userController.getAllUsers);
router.get('/getAllUsersOld', firebaseAuth, userController.getAllUsersOld);
router.post('/addUserPlan', firebaseAuth, userController.addPlan);
router.post('/getUserPlan', firebaseAuth, userController.getUserPlans);
router.post('/editUserPlanEntries', firebaseAuth, userController.editEntries);
router.post('/deleteUserPlan', firebaseAuth, userController.deleteUserPlan);


module.exports = router;