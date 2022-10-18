const express = require('express');
const db = require(__dirname + "/../../db");

const router = express.Router();

core = require('../../public/js-core/chat-core');
DataGenerator = require('../../public/test/generator-data');

User = core.User;
Message = core.Message;
Chat = core.Chat;

router.post('/login/', function (req, res, next) {
    const username = req.param("username", "");
    const password = req.param("password", "");
    const userToLogin = new User(username, null, password);
    // console.log("***", username);
    db.getUser(userToLogin)
        .then(users => {
            if (users.length > 0) {
                const loggedUser = new User(users[0].username, users[0].img);
                res.status(200);
                res.send(loggedUser.toJSON());
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

router.post('/sign_up/', function (req, res, next) {
    const username = req.param("username");
    const imgURL = req.param("img_url");
    const password = req.param("password");
    const newUser = new User(username, imgURL, password);
    db.insertUser(newUser)
        .then(success => {
            res.status(201);
            res.end()
        })
        .catch(_ => {
            //console.error("errore", _);
            res.status(400);
            res.end()
        });
    res.setHeader('Content-Type', 'application/json');

});


router.get('/list/', function (req, res, next) {
    const username = req.param("username");
    const usernameQuery = req.param("q");
    const userFrom = new User(username);
    db.getUser(userFrom)
        .then(users => {
            if (users.length > 0)
                return db.listUserWithoutChat(userFrom, usernameQuery);
            else
                throw new Error("");
        })
        .then(usersData => {
            const users = [];
            usersData.forEach(userData => {
                const user = new User(userData.username, userData.img);
                users.push(user.toJSON(user))
            });
            res.status(200);
            return users;
        })
        .catch(_ => {
            res.status(404);
            return null;
        })
        .then(body => res.send(body));
    res.setHeader('Content-Type', 'application/json');

});
module.exports = router;