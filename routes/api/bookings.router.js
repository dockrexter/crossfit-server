var express = require("express");
var router = express.Router();

var bookingsController = require("../../controllers/bookings.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/getBookings', firebaseAuth, bookingsController.getBookings);
router.post('/addUser', firebaseAuth, bookingsController.addUser);
router.post('/removeUser', firebaseAuth, bookingsController.removeUser);
router.post('/removeFromWaitingList', firebaseAuth, bookingsController.removeFromWaitingList);


module.exports = router;