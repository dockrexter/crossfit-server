var express = require("express");
var router = express.Router();

var timetableController = require("../../controllers/timetable.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/getTimeTable', firebaseAuth, timetableController.getTimeTable);
router.post('/getCompleteTimeTable', timetableController.getCompleteTimeTable);
router.post('/setTimeTable', timetableController.setTimeTable);
router.post('/deleteEvent', firebaseAuth, timetableController.deleteEvent);

module.exports = router;