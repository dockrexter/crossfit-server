var express = require("express");
var router = express.Router();

var membershipsController = require("../../controllers/memberships.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/getBookings', firebaseAuth, membershipsController.addMembership);

module.exports = router;