const sidePanelView = new SidePanelView("sidepanel");
const sidePanelModel = new SidePanelModel();
const sidePanelController = new SidePanelController(sidePanelView, sidePanelModel);

const chatFrameView = new ChatFrameView("active-chat");
const chatFrameModel = new ChatFrameModel();
const chatFrameController = new ChatFrameController(sidePanelView, chatFrameView, chatFrameModel);

REQUESTER.start();
