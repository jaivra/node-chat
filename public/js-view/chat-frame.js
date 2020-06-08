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

        const pContact = document.createElement("p");
        pContact.innerText = userTo.username;

        divContact.appendChild(imgContact);
        divContact.appendChild(pContact);

        return divContact;

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

        // submitButton.appendChild(iconButton);
        // submitButton.onclick = function() {
        //     newMessage();
        // });

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

        chatSidePanelView.addObserver(this.onActiveChatChanged.bind(this));
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
        let messages = null;
        chats.forEach(chat => {
            const usernameActiveTo = this._activeChat.to.username;
            const messagesTmp = chat.messages;
            console.log("+++", chat, this._activeChat);
            if (chat.lastMessage.timestamp > this._activeChat.lastMessage.timestamp && (messagesTmp[0].fromUsername === usernameActiveTo || messagesTmp[0].toUsername === usernameActiveTo))
                messages = messagesTmp

        });
        if (messages)
            messages.forEach(message => chatFrameView.addViewMessage(message));
    }
}