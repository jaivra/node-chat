class ChatFrameView extends ObservableView {
    constructor(chatElementId) {
        super();
        this._chatElement = document.getElementById(chatElementId);
    }

    updateActiveChatView(){

    }

    _resetActiveChatView(){
        this._chatElement.innerHTML = "";
    }

    _addActiveChatToFrame(chat){
        const divContent = document.createElement("div");
        divContent.setAttribute("class", "content");

        const divContact = document.createElement("div");
        divContact.setAttribute("class","contact-profile");

        const imgContact = document.createElement("img");
        imgContact.setAttribute("src", chat.to.imgURL);

        const pContact = document.createElement("p");
        pContact.setAttribute("class", )
    }
}

class ChatFrameController {
    constructor(chatSidePanelView, chatFrameView, chatFrameModel) {
        this._chatFrameView = chatFrameView;
        this._chatFrameModel = chatFrameModel;

        chatSidePanelView.addObserver(this.onActiveChatChanged.bind(this));

    }

    onActiveChatChanged(observable, chat) {
        console.log("Cliccata:", chat);
    }

}

class ChatFrameModel {
    constructor() {
        this.activeChat = null;
    }

    updateActiveChat(chat){
        this.activeChat = chat;

    }
}