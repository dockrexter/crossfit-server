var express = require("express");
var router = express.Router();

var prController = require("../../controllers/pr.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/addPrCategory', firebaseAuth, prController.addPrCategory);
router.post('/editPrCategory', firebaseAuth, prController.editPrCategory);
router.get("/getPr", firebaseAuth, prController.getPr);
router.post("/addPr", firebaseAuth, prController.addPr);
router.post("/deletePr", firebaseAuth, prController.deletePr);
router.post("/editPr", firebaseAuth, prController.editPr);

module.exports = router;