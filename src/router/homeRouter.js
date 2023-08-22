var express = require("express");
var router = express.Router();
const log = require('../config/logger.js')

let bodyParser = require('body-parser');

// To allow body parameters
router.use(bodyParser.json());

// Current Path: "/"

var cb_home = async function (req, res, next) {
    var html = JSON.stringify({
        "status": "ready"
    }, null, 4);
    res.send(html);
};

router.get("/", [cb_home]);

module.exports = router