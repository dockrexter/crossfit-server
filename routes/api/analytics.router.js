var express = require("express");
var router = express.Router();

var analyticsController = require("../../controllers/analytics.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getAnalytics', firebaseAuth, analyticsController.getAnalytics);



module.exports = router;