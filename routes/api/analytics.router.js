var express = require("express");
var router = express.Router();

var analyticsController = require("../../controllers/analytics.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getBarChat', analyticsController.getBarChat);
// router.post('/addUser', firebaseAuth, bookingsController.addUser);
// router.post('/removeUser', firebaseAuth, bookingsController.removeUser);
// router.post('/removeFromWaitingList', firebaseAuth, bookingsController.removeFromWaitingList);


module.exports = router;