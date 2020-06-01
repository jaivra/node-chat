const express = require('express');
const router = express.Router();

router.get('/test/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(__dirname);
  // res.sendFile(path.join(__dirname + '/tmp.html'));

});

module.exports = router;
