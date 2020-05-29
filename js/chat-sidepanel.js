class SidePanelView extends ObservableView {
    constructor(contactsElementId) {
        super();
        this._contactsElement = document.getElementById(contactsElementId);
        this._activeChatView = null;
        this._activeClassTagName = "active";
    }

    updateChatsView(chats) {
        // let needToUpdateView = false;
        // chats.forEach(chat => {
        //     const isNewChat = this._chatsElements.some(chatElement => {
        //         return chatElement.id === chat.id
        //     });
        //     if (isNewChat)
        //         needToUpdateView = true;
        //     this._chatsElements.append(chat);
        // });
        this._resetChatsListView();
        chats.forEach(chat => {
            this._addNewChatsListView(chat);
        });
    }

    _resetChatsListView() {
        const listView = this._contactsElement.getElementsByTagName("ul")[0];
        listView.innerHTML = "";
    }

    _addNewChatsListView(chat) {
        const chatElement = this._createHtmlChatElement(chat);
        const listView = this._contactsElement.getElementsByTagName("ul")[0];

        listView.append(chatElement);
        // this._contactsList(chatView, this._contactsList[0]);
    }

    //TODO do compatible code with oldest browser
    _onChatClicked(lastActiveChatView, lastActiveChat) {
        if (this._activeChatView !== null) {
            this._activeChatView.classList.remove(this._activeClassTagName);
        }
        this._activeChatView = lastActiveChatView;
        this._activeChatView.classList.add(this._activeClassTagName);
        this.notifyObserver(lastActiveChat);
    }

    _createHtmlChatElement(chat) {
        const userTo = chat.to;
        const lastMessage = chat.lastMessage;

        const liContact = document.createElement("li");
        liContact.setAttribute("class", "contact");
        liContact.setAttribute("id", chat.id);

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

        liContact.onclick = this._onChatClicked.bind(this, liContact, chat);
        if (this._activeChatView !== null && this._activeChatView.id === liContact.id){
            this._activeChatView = liContact;
            liContact.classList.add(this._activeClassTagName);
        }

        return liContact;
    }

    static _lastMessagePreview(lastMessage) {
        const messagePreview = lastMessage.from.id === CURRENT_USER.id ? "<span>You:</span>" : "";
        return messagePreview + lastMessage.text
    }
}


class SidePanelController {
    constructor(sidePanelView, sidePanelModel) {
        this._sidePanelView = sidePanelView;
        this._sidePanelModel = sidePanelModel;
        this._sidePanelView.addObserver(this.onActiveChatChanged.bind(this));
    }

    onActiveChatChanged(observable, chat) {
        console.log("Cliccata:", chat);
    }

    onUpdateChat(chats) {
        this._sidePanelModel.updateChats(sidePanelView, chats)
    }
}

class SidePanelModel {
    constructor() {
        this._chats = []
    }

    updateChats(sidePanelView, chats) {
        chats.forEach(chat => {
            const containstAlready = this._hasChat(chat);
            if (!containstAlready)
                this._chats.push(chat);
        });
        this._sortChats();
        sidePanelView.updateChatsView(this._chats);
    }

    _hasChat(newChat) {
        return this._chats.some(chat => {
            return chat.id === newChat.id
        });
    }

    _sortChats() {
        this._chats.sort((chat1, chat2) => {
            return chat2.lastMessage.timestamp - chat1.lastMessage.timestamp;
        })
    }

    tmp() {
        console.log("*****", this._chats);
    }
}
