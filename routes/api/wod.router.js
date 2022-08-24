var express = require("express");
var router = express.Router();

var wodController = require("../../controllers/wod.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/getWod', firebaseAuth, wodController.getWod);
router.post('/setWod', firebaseAuth, wodController.setWod);


module.exports = router;