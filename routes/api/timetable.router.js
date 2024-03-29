var express = require("express");
var router = express.Router();

var timetableController = require("../../controllers/timetable.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/getTimeTable', firebaseAuth, timetableController.getTimeTable);
router.post('/getCompleteTimeTable', firebaseAuth, timetableController.getCompleteTimeTable);
router.post('/setTimeTable', firebaseAuth, timetableController.setTimeTable);
router.post('/deleteEvent', firebaseAuth, timetableController.deleteEvent);
router.post('/editEvent', firebaseAuth, timetableController.editEvent);

module.exports = router;