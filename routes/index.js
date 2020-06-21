const express = require('express');
const router = express.Router();
const db = require(__dirname + "/../db");

core = require('../public/js-core/chat-core');
DataGenerator = require('../public/test/generator-data');

User = core.User;
Message = core.Message;
Chat = core.Chat;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');

});
router.get('/login/', function (req, res, next) {
  res.render('login');
});


function test() {
    const currentUser = new User("user-id-0", "IO", "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_10-512.png");

    const dataGenerator = new DataGenerator();

    const user1 = dataGenerator.generateUser();

    const oldestChat = dataGenerator.generateChat(user1);
    oldestChat.addMessage(dataGenerator.generateMessage(user1, currentUser));

    const chats = dataGenerator.generateCompleteChats(currentUser);
    return chats;
}


module.exports = router;

