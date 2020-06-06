const express = require('express');
const db = require(__dirname + "/../../db");

const router = express.Router();

core = require('../../public/js-core/chat-core');
DataGenerator = require('../../public/test/generator-data');

User = core.User;
Message = core.Message;
Chat = core.Chat;

router.post('/login/', function (req, res, next) {
    const username = req.param("username");
    const password = req.param("password");
    const userToLogin = new User(username, null, password);
    console.log(username, password);
    db.getUser(userToLogin)
        .then(users => {
            console.log("response:", users.length);
            if (users.length > 0) {
                res.status(200);
                res.json(JSON.stringify(users));
            } else {
                res.status(404);
                res.end()
            }
        });
    res.setHeader('Content-Type', 'application/json');

});


router.get('/exists/', function (req, res, next) {
    const username = req.param("username");
    const userToCheck = new User(username);
    db.getUser(userToCheck)
        .then(users => {
            if (users.length > 0)
                res.status(200);
            else
                res.status(404);

            res.end()
        });
    res.setHeader('Content-Type', 'application/json');

});

router.post('/signup/', function (req, res, next) {
    const username = req.param("username");
    const imgURL = req.param("imgURL");
    const password = req.param("password");
    const newUser = new User( username, imgURL, password);
    db.insertUser(newUser)
        .then(success => {
            res.status(201);
            res.end()
        })
        .catch(_ => {
            console.log("errore", _);
            res.status(400);
            res.end()
        });
    res.setHeader('Content-Type', 'application/json');

});

module.exports = router;