var express = require("express");
var router = express.Router();

var timetableController = require("../../controllers/timetable.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getTimeTable', firebaseAuth, timetableController.getTimeTable);
router.get('/getCompleteTimeTable', firebaseAuth, timetableController.getCompleteTimeTable);
router.post('/setTimeTable', firebaseAuth, timetableController.setTimeTable);
router.delete('/deleteEvent', firebaseAuth, timetableController.deleteEvent);

module.exports = router;