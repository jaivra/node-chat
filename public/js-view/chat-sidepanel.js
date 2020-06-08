class SidePanelView extends ObservableView {
    constructor(contactsElementId) {
        super();
        this._contactsElement = document.getElementById(contactsElementId);
        this._activeChatView = null;
        this._activeClassTagName = "active";
    }

    updateChatsView(chats) {
        this._resetChatsListView();
        this._addNewChatsListView(chats);
    }

    _resetChatsListView() {
        this._contactsElement.innerHTML = "";
    }

    _addNewChatsListView(chats) {
        const chatsElement = document.createElement("ul");
        chats.forEach(chat => {
            const chatElement = this._createHtmlChatElement(chat);
            chatsElement.appendChild(chatElement);
        });
        this._contactsElement.appendChild(chatsElement);

    }

    //TODO do compatible code with oldest browser
    _chatClicked(lastActiveChatView, lastActiveChat) {
        if (this._activeChatView !== null)
            this._activeChatView.classList.remove(this._activeClassTagName);
        this._activeChatView = lastActiveChatView;
        this._activeChatView.classList.add(this._activeClassTagName);
        this.notifyObserver(lastActiveChat);
    }

    _createHtmlChatElement(chat) {
        const userTo = chat.to;
        const lastMessage = chat.lastMessage;


        const liContact = document.createElement("li");
        liContact.setAttribute("class", "contact");
        liContact.setAttribute("id", chat.to.username);

        const spanContact = document.createElement("span");
        spanContact.setAttribute("class", "contact-status");

        const divWrap = document.createElement("div");
        divWrap.setAttribute("class", "wrap");

        const userImg = document.createElement("img");
        console.log(userTo.imgURL);
        userImg.setAttribute("src", userTo.imgURL);
        userImg.setAttribute("alt", " ");

        const divMeta = document.createElement("div");
        divMeta.setAttribute("class", "meta");

        const pName = document.createElement("p");
        pName.setAttribute("class", "name");
        pName.innerText = userTo.name;

        const pPreview = document.createElement("p");
        pPreview.setAttribute("class", "preview");
        pPreview.innerHTML = SidePanelView._lastMessagePreview(lastMessage);

        divMeta.appendChild(pName);
        divMeta.appendChild(pPreview);
        divWrap.appendChild(spanContact);
        divWrap.appendChild(userImg);
        divWrap.appendChild(divMeta);
        liContact.appendChild(divWrap);

        console.log(this._activeChatView !== null);
        if (this._activeChatView !== null) {
            if (this._activeChatView.id === liContact.id) {
                this._activeChatView = liContact;
                liContact.classList.add(this._activeClassTagName);
            }
        } else
            this._chatClicked(liContact, chat);


        liContact.onclick = function () {
            if (this._activeChatView.id !== liContact.id)
                this._chatClicked(liContact, chat);
        }.bind(this);


        return liContact;
    }

    static _lastMessagePreview(lastMessage) {
        const messagePreview = lastMessage.from_username === CURRENT_USER.username ? "<span>You:</span>" : "";
        return messagePreview + lastMessage.text
    }
}


class SidePanelController {
    constructor(sidePanelView, sidePanelModel) {
        this._sidePanelView = sidePanelView;
        this._sidePanelModel = sidePanelModel;
        REQUESTER.addObserver(this);
    }

    onActiveChatChanged(observable, chat) {
        console.log("Cliccata:", chat);
    }

    onUpdateChat(chats) {
        console.log("SIDE PANEL", chats);
        this._sidePanelModel.updateChats(this._sidePanelView, chats)
    }
}

class SidePanelModel {
    constructor() {
        this._chats = []
    }

    updateChats(sidePanelView, chats) {
        chats.forEach(chat => {
            const exists = this._addMessages(chat);
            if (!exists)
                this._chats.push(chat);
        });
        this._sortChats();
        sidePanelView.updateChatsView(this._chats);
    }

    _addMessages(newChat) {
        return this._chats.some(chat => {
            if (chat.to.username === newChat.to.username) {
                newChat.messages.forEach(message => chat.addMessage(message));
                return true;
            }
            return false;
        });
    }

    _sortChats() {
        this._chats.sort((chat1, chat2) => {
            return chat2.lastMessage.timestamp - chat1.lastMessage.timestamp;
        })
    }
}
