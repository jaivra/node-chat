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
    const currentUser = new User(username);
    db.getMessages(currentUser, timestamp)
        .then(messagesData => {

            const messages = [];
            messagesData.forEach(messageData => {
                let message = new Message(messageData.user_from, messageData.user_to, messageData.text, messageData.timestamp);
                messages.push(message);
            });

            const usersToData = [];
            const usersFlag = new Set();
            messagesData.forEach(messageData => {
                let item = null;
                if (messageData.user_from !== currentUser.username)
                    item = [messageData.user_from, messageData.img_url];
                else if (messageData.user_to !== currentUser.username)
                    item = [messageData.user_to, messageData.img_url];

                if (item !== null && !usersFlag.has(item[0])){
                    usersFlag.add(item[0]);
                    usersToData.push(item);
                }
            });

            const chats = [];
            usersToData.forEach(user_to_data => {
                const userTo = new User(user_to_data[0], user_to_data[1]);

                const chat = new Chat(userTo, []);
                messages.forEach(message => {
                    if (message.fromUsername === user_to_data[0] || message.toUsername === user_to_data[0])
                        chat.addMessage(message);

                });
                chats.push(chat);
            });

            res.status(200);
            return chats;
        })
        .then(chats => {
            const chatsJson = [];
            chats.forEach(chat => chatsJson.push(chat.toJson()));
            res.send(chatsJson)
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