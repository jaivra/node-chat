class ChatFrameView extends ObservableView {
    constructor(chatElementId) {
        super();
        this._chatElement = document.getElementById(chatElementId);
        this._inputElement = this._createChatInputElement();
        this._listMessagesElement = null;
        this._to = null;
    }

    addViewMessage(message) {
        const messageElement = this._createMessageElement(message);
        this._listMessagesElement.appendChild(messageElement);
        this._scrollViewToLastMessage();
    }

    updateActiveChatView(chat) {
        this._to = chat.to;
        this._resetActiveChatView();
        this._addActiveChatToFrame(chat);
        this._scrollViewToLastMessage();
    }


    _resetActiveChatView() {
        this._chatElement.innerHTML = "";
    }

    _addActiveChatToFrame(chat) {
        const chatHeaderElement = this._createChatHeaderElement(chat);
        const chatMessagesElement = this._createChatMessagesElement(chat);

        this._chatElement.appendChild(chatHeaderElement);
        this._chatElement.appendChild(chatMessagesElement);
        this._chatElement.appendChild(this._inputElement);
    }

    _scrollViewToLastMessage() {
        const lastMessage = this._listMessagesElement.lastElementChild;
        lastMessage.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    _createChatHeaderElement(chat) {
        const userTo = chat.to;

        const divContact = document.createElement("div");
        divContact.setAttribute("class", "contact-profile");

        const imgContact = document.createElement("img");
        imgContact.setAttribute("src", userTo.imgURL);
        imgContact.setAttribute("onerror", "this.src='https://www.dalarail.com/files/dummy-1.png'");

        const pContact = document.createElement("p");
        pContact.innerText = userTo.username;

        divContact.appendChild(imgContact);
        divContact.appendChild(pContact);

        return divContact;

    }

    _onClickSendMessage(textElement) {
        const text = textElement.value;
        if (text !== "" && this._to !== null) {
            REQUESTER.sendMessage(this._to.username, text);
            textElement.value = "";
        }
    }

    _createChatInputElement() {
        const divInput = document.createElement("div");
        divInput.setAttribute("class", "message-input");

        const divWrap = document.createElement("div");
        divWrap.setAttribute("class", "wrap");

        const inputText = document.createElement("input");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("placeholder", "Scrivi qualcosa...");

        const submitButton = document.createElement("button");
        submitButton.setAttribute("class", "submit");

        const iconButton = document.createElement("i");
        iconButton.setAttribute("class", "fa fa-paper-plane");
        iconButton.setAttribute("aria-hidden", "true");

        submitButton.appendChild(iconButton);
        submitButton.onclick = function () {
            this._onClickSendMessage(inputText);
        }.bind(this);

        inputText.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                this._onClickSendMessage(inputText);
            }
        }.bind(this));

        // $(window).on('keydown', function (e) {
        //     if (e.which === 13) {
        //         newMessage();
        //         return false;
        //     }
        // });
        submitButton.appendChild(iconButton);
        divWrap.appendChild(inputText);
        divWrap.appendChild(submitButton);

        divInput.appendChild(divWrap);

        return divInput
    }

    _createChatMessagesElement(chat) {
        const messages = chat.messages;

        const divMessages = document.createElement("div");
        divMessages.setAttribute("class", "messages");

        const ulMessages = document.createElement("ul");

        messages.forEach(message => {
            const messagesElement = this._createMessageElement(message);
            ulMessages.append(messagesElement);
        });

        this._listMessagesElement = ulMessages;

        divMessages.appendChild(ulMessages);
        return divMessages;


    }

    _createMessageElement(message) {
        const liMessage = document.createElement("li");
        let userImg = "";
        if (message.isSentMessage()) {
            userImg = CURRENT_USER.imgURL;
            liMessage.setAttribute("class", "sent");
        } else {
            userImg = this._to.imgURL;
            liMessage.setAttribute("class", "replies");
        }
        const imgMessage = document.createElement("img");
        imgMessage.setAttribute("src", userImg);
        imgMessage.setAttribute("onerror", "this.src='https://www.dalarail.com/files/dummy-1.png'");

        const pText = document.createElement("p");
        pText.innerText = message.text;

        liMessage.appendChild(imgMessage);
        liMessage.appendChild(pText);

        return liMessage;
    }
}

class ChatFrameController {
    constructor(chatSidePanelView, chatFrameView, chatFrameModel) {
        this._chatFrameView = chatFrameView;
        this._chatFrameModel = chatFrameModel;

        chatSidePanelView.addObserver("activeChatChange", this.onActiveChatChanged.bind(this));
        REQUESTER.addObserver(this);
    }

    onActiveChatChanged(observable, chat) {
        this._chatFrameModel.updateActiveChat(this._chatFrameView, chat.clone());
    }

    onUpdateChat(chats) {
        this._chatFrameModel.updateMessages(this._chatFrameView, chats);
    }

}

class ChatFrameModel {
    constructor() {
        this._activeChat = null;
    }

    updateActiveChat(chatFrameView, chat) {
        this._activeChat = chat;
        chatFrameView.updateActiveChatView(chat);

    }

    updateMessages(chatFrameView, chats) {

        let messages = [];
        chats.forEach(chat => {
            const usernameActiveTo = this._activeChat.to.username;
            const userTmp = chat.to;
            const messagesTmp = chat.messages;
            if ((userTmp.username === usernameActiveTo || userTmp.username === usernameActiveTo) && chat.lastMessage.timestamp > this._activeChat.lastMessage.timestamp) {
                messagesTmp.forEach(message => {
                    if (message.timestamp > this._activeChat.lastMessage.timestamp){
                        messages.push(message);
                        this._activeChat.addMessage(message);
                    }
                })
            }

        });
        if (messages.length > 0)
            messages.forEach(message => chatFrameView.addViewMessage(message));
    }
}