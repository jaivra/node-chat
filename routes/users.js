const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    console.log("éééééééé")
    res.render('work');
    console.log(__dirname);
    // res.sendFile(path.join(__dirname + '/tmp.html'));

});

module.exports = router;