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
    // const username = req.param("username");
    // const data = {};
    // data.user = new User("user-id-0", "IO", "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_10-512.png");
    // data.chats = test();
    // res.render('test', {JSON_DATA: JSON.stringify(data)});
    res.render('test');
    // console.log("****",DataGenerator);
    // res.sendFile(path.join(__dirname + '/tmp.html'));

});
router.get('/login/', function (req, res, next) {
  res.render('login');
  // console.log("****",DataGenerator);
  // res.sendFile(path.join(__dirname + '/tmp.html'));

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


// console.log(__dirname);
module.exports = router;
