var express = require("express");
var router = express.Router();

var settingsController = require("../../controllers/settings.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getSettings', firebaseAuth, settingsController.getSettings);
router.post('/editSettings', firebaseAuth, settingsController.editSettings);

module.exports = router;