var express = require("express");
var router = express.Router();

var timetableController = require("../../controllers/timetable.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.get('/getTimeTable', timetableController.getTimeTable);
router.post('/setTimeTable', timetableController.setTimeTable);



module.exports = router;