const express = require('express');
const db = require(__dirname + "/../../db");

const router = express.Router();

core = require('../../public/js-core/chat-core');
DataGenerator = require('../../public/test/generator-data');

User = core.User;
Message = core.Message;
Chat = core.Chat;


router.post('/', function (req, res, next) {
    const usernameFrom = req.param("username_from");
    const usernameTo = req.param("username_to");
    const timestamp = req.param("timestamp");
    const text = req.param("text");

    const userFrom = new User(usernameFrom);
    const userTo = new User(usernameTo);

    db.insertMessage(userFrom, userTo, timestamp, text)
        .then(messages => {
            console.log("response:", messages);
            // if (users.length > 0) {
            //     res.status(200);
            //     res.json(JSON.stringify(users));
            // } else {
            //     res.status(404);
            res.end()
        });
    res.setHeader('Content-Type', 'application/json');

});

router.get('/', function (req, res, next) {
    const username = req.param("username");
    const timestamp = req.param("timestamp", 0);
    const userFrom = new User(username);
    db.getMessages(userFrom, timestamp)
        .then(messages_data => {
            console.log("****", messages_data);
            const users_to_data = new Set();

            const messages = [];
            messages_data.forEach(messages_data => {
                let message = new Message(messages_data.user_from, messages_data.user_to, messages_data.text, messages_data.timestamp);
                messages.push(message);
            });

            messages.forEach(message => {
                users_to_data.add(message.from);
                users_to_data.add(message.to);
            });
            users_to_data.delete(userFrom.username);


            const chats = [];
            users_to_data.forEach(user_to_data => {
                const user_to = new User(user_to_data);
                const chat = new Chat(user_to, []);
                messages.forEach(message => {
                    if (message.from === user_to || message.to === user_to)
                        chat.addMessage(message)
                });
                chats.push(chat);
            });

            res.status(200);
            console.log("+++++++", chats[0].messages);
            return chats;
        })
        .then(chats=>{
            res.send(JSON.stringify(chats))
        })
        .catch(_ => {
            console.log("ERROR:", _);
            res.status(400);
        })
        .then(_ => res.end());
    res.setHeader('Content-Type', 'application/json');

    const generateChatFromMessages = function (messages, userFrom) {


    }

});


router.get('/exists/', function (req, res, next) {
    const username = req.param("username");
    const userToCheck = new User(null, username, null, null);
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
    const newUser = new User(null, username, imgURL, password);
    db.insertUser(newUser)
        .then(success => {
            res.status(201);
            res.end()
        })
        .catch(_ => {
            res.status(400);
            res.end()
        });
    res.setHeader('Content-Type', 'application/json');

});

module.exports = router;