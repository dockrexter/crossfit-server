var express = require("express");
var router = express.Router();

var membershipsController = require("../../controllers/memberships.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/addMembership', firebaseAuth, membershipsController.addMembership);
router.post('/deleteMembership', firebaseAuth, membershipsController.deleteMembership);
router.post('/editMembership', firebaseAuth, membershipsController.editMembership);
router.get('/getMemberships', firebaseAuth, membershipsController.getMemberships);

module.exports = router;