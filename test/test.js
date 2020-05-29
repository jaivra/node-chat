CURRENT_USER = new User("user-id-0", "IO", "ME", "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_10-512.png");
const dataGenerator = new DataGenerator();
const user1 = dataGenerator.generateUser();

const oldestChat = dataGenerator.generateChat(user1);
oldestChat.addMessage(dataGenerator.generateMessage(user1, CURRENT_USER));
const sidePanelView = new SidePanelView("contacts");
const sidePanelModel = new SidePanelModel();
const sidePanelController = new SidePanelController(sidePanelView, sidePanelModel);

chats = dataGenerator.generateCompleteChats();
setTimeout(() => {
    console.log("1");
    chats.push(oldestChat);
    sidePanelController.onUpdateChat(chats);

}, 2500);
setTimeout(() => {
    console.log("2");
    oldestChat.addMessage(dataGenerator.generateMessage(CURRENT_USER, user1));
    sidePanelController.onUpdateChat(chats);

}, 5000);


sidePanelController.onUpdateChat(chats);