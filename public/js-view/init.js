const CURRENT_USER = User.fromJSON(JSON_DATA.user);
const CHATS = []
JSON_DATA.chats.forEach(chat =>{
    CHATS.push(Chat.fromJSON(chat))
})