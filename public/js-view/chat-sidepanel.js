class SidePanelView extends ObservableView {
    constructor(sidePanelElementId) {
        super();
        this._sidePanelElement = document.getElementById(sidePanelElementId);
        this._initView();
        this._activeChatView = null;
        this._activeClassTagName = "active";
    }

    _initView() {
        const profileView = document.createElement("div");
        profileView.setAttribute("id", "profile");
        const divWrapProfile = document.createElement("div");
        divWrapProfile.setAttribute("class", "wrap");

        const imgProfile = document.createElement("img");
        imgProfile.setAttribute("id", "profile-img");
        imgProfile.setAttribute("src", CURRENT_USER.imgURL);
        imgProfile.setAttribute("class", "online");
        imgProfile.setAttribute("onerror", "this.src='https://www.dalarail.com/files/dummy-1.png'");

        const profileName = document.createElement("p");
        profileName.innerText = CURRENT_USER.username;

        const searchChat = document.createElement("div");
        searchChat.setAttribute("id", "search");
        const labelSearch = document.createElement("label");
        const iconSearch = document.createElement("i");
        iconSearch.setAttribute("class", "fa fa-search");
        iconSearch.setAttribute("aria-hidden", "true");
        this._inputSearchList = document.createElement("input");
        this._inputSearchList.setAttribute("type", "text");
        this._inputSearchList.setAttribute("placeholder", "Cerca nuovi contatti..");
        labelSearch.appendChild(iconSearch);
        searchChat.appendChild(labelSearch);
        searchChat.appendChild(this._inputSearchList);

        divWrapProfile.appendChild(imgProfile);
        divWrapProfile.appendChild(profileName);
        profileView.appendChild(divWrapProfile);


        this._contactsElement = document.createElement("div");
        this._contactsElement.setAttribute("id", "contacts");

        this._contactsSearchedElement = document.createElement("div");
        this._contactsSearchedElement.setAttribute("id", "contacts_searched");
        this._contactsSearchedElement.style.display = "none";

        this._sidePanelElement.appendChild(profileView);
        this._sidePanelElement.appendChild(searchChat);
        this._sidePanelElement.appendChild(this._contactsElement);
        this._sidePanelElement.appendChild(this._contactsSearchedElement);
    }

    setSearchChatListener(callback) {
        this._inputSearchList.addEventListener('input', _ => {
            callback(this._inputSearchList.value)
        });
    }

    updateChatsView(chats) {
        this._contactsSearchedElement.style.display = "none";
        this._contactsElement.style.display = "block";

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
        this.notifyObserver("activeChatChange", lastActiveChat);
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
        userImg.setAttribute("src", userTo.imgURL);
        userImg.setAttribute("alt", " ");
        userImg.setAttribute("onerror", "this.src='https://www.dalarail.com/files/dummy-1.png'");

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

    updateSearchedChatsView(users) {
        this._contactsElement.style.display = "none";
        this._contactsSearchedElement.style.display = "block";

        this._resetChatsSearchedListView();
        this._addSearchedChatsListView(users);
    }

    _resetChatsSearchedListView() {
        this._contactsSearchedElement.innerHTML = ""
    }

    _addSearchedChatsListView(users) {
        console.log(users);
        const chatsElement = document.createElement("ul");
        users.forEach(user => {
            const chatElement = this._createHtmlSearchedUserElement(user);
            chatsElement.appendChild(chatElement);
        });
        this._contactsSearchedElement.appendChild(chatsElement);
    }

    _createHtmlSearchedUserElement(user) {
        const userTo = user;

        const liContact = document.createElement("li");
        liContact.setAttribute("class", "contact");
        liContact.setAttribute("id", userTo.username);

        const spanContact = document.createElement("span");
        spanContact.setAttribute("class", "contact-status");

        const divWrap = document.createElement("div");
        divWrap.setAttribute("class", "wrap");

        const userImg = document.createElement("img");
        userImg.setAttribute("src", userTo.imgURL);
        userImg.setAttribute("alt", " ");
        userImg.setAttribute("onerror", "this.src='https://www.dalarail.com/files/dummy-1.png'");

        const divMeta = document.createElement("div");
        divMeta.setAttribute("class", "meta");

        const pName = document.createElement("p");
        pName.setAttribute("class", "name");
        pName.innerText = userTo.name;

        const pPreview = document.createElement("p");
        pPreview.setAttribute("class", "preview");

        divMeta.appendChild(pName);
        divMeta.appendChild(pPreview);
        divWrap.appendChild(spanContact);
        divWrap.appendChild(userImg);
        divWrap.appendChild(divMeta);
        liContact.appendChild(divWrap);

        liContact.onclick = function () {
            this.notifyObserver("startNewChat", userTo);
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
        sidePanelView.addObserver("startNewChat", this.onStartNewChat.bind(this));

        this._sidePanelView.setSearchChatListener(this.onSearchTextChanged.bind(this));
        REQUESTER.addObserver(this);
    }

    onSearchTextChanged(value) {
        this._sidePanelModel.searchUsers(this._sidePanelView, value);

    }

    onStartNewChat(observable, user) {
        this._sidePanelModel.startNewChat(this._sidePanelView, user);
    }

    onUpdateChat(chats) {
        this._sidePanelModel.updateChats(this._sidePanelView, chats)
    }
}

class SidePanelModel {
    constructor() {
        this._chats = [];
        this._lastSearchQuery = null;
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

    //TODO check last message timestamp
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

    searchUsers(sidePanelView, query) {
        const onSearchResult = function (users, querySearched) {
            console.log("****", querySearched);
            if (querySearched === this._lastSearchQuery)
                if (querySearched === "")
                    sidePanelView.updateChatsView(this._chats);
                else
                    sidePanelView.updateSearchedChatsView(users);
        }.bind(this);
        this._lastSearchQuery = query;
        REQUESTER.listUser(query, onSearchResult);
    }

    startNewChat(sidePanelView, userTo){
        this._lastSearchQuery = "";
        REQUESTER.sendMessage(userTo.username, "Ciao " + userTo.username)
        sidePanelView.updateChatsView(this._chats);
    }


}
