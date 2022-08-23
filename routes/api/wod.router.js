var express = require("express");
var router = express.Router();

var wodController = require("../../controllers/wod.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getWod', firebaseAuth, userController.getUser);
router.get('/getAllusers', firebaseAuth, userController.getAllUsers);

module.exports = router;