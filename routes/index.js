var express = require('express');
var router = express.Router();
router.get("/", async (req, res, next) => {

    res.status(200).send("hello fitness freaks")
})

module.exports = router;