// const CURRENT_USER = User.fromJSON(JSON_DATA.user);
// const CHATS = []
// JSON_DATA.chats.forEach(chat =>{
//     CHATS.push(Chat.fromJSON(chat))
// })

const sidePanelView = new SidePanelView("contacts");
const sidePanelModel = new SidePanelModel();
const sidePanelController = new SidePanelController(sidePanelView, sidePanelModel);

const chatFrameView = new ChatFrameView("active-chat");
const chatFrameModel = new ChatFrameModel();
const chatFrameController = new ChatFrameController(sidePanelView, chatFrameView, chatFrameModel);

REQUESTER.start();