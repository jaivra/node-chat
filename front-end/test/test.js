CURRENT_USER = new User("user-id-0", "IO", "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_10-512.png");
const sidePanelView = new SidePanelView("contacts");
const sidePanelModel = new SidePanelModel();
const sidePanelController = new SidePanelController(sidePanelView, sidePanelModel);

const chatFrameView = new ChatFrameView("active-chat");
const chatFrameModel = new ChatFrameModel();
const chatFrameController = new ChatFrameController(sidePanelView, chatFrameView, chatFrameModel);


const dataGenerator = new DataGenerator();
const user1 = dataGenerator.generateUser();

const oldestChat = dataGenerator.generateChat(user1);
oldestChat.addMessage(dataGenerator.generateMessage(user1, CURRENT_USER));


chats = dataGenerator.generateCompleteChats();
sidePanelController.onUpdateChat(chats);



setTimeout(() => {
    console.log("1");
    chats.push(oldestChat);
    sidePanelController.onUpdateChat(chats);

}, 1500);
setTimeout(() => {
    chatFrameController.onMessageArrived(dataGenerator.generateMessage(CURRENT_USER, user1))

}, 5500);


// setTimeout(() => {
//     console.log("2");
//     oldestChat.addMessage(dataGenerator.generateMessage(CURRENT_USER, user1));
//     sidePanelController.onUpdateChat(chats);
//
// }, 5000);


