var express = require("express");
var router = express.Router();

var prController = require("../../controllers/pr.controller");
const firebaseAuth = require('../../middleware/firebase-auth');

router.post('/addPrCategory', prController.addPrCategory);
router.post('/editPrCategory', prController.editPrCategory);
router.get("/getPr", prController.getPr);
router.post("/addPr", prController.addPr);
router.post("/deletePr", prController.deletePr);
router.post("/editPr", prController.editPr);

module.exports = router;