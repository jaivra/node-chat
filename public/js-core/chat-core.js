class User {
    constructor(username, imgURL, password) {
        this._username = username;
        this._imgURL = imgURL;
        this._password = password
    }

    get username() {
        return this._username;
    }

    get name() {
        return this._username;
    }

    get imgURL() {
        return this._imgURL;
    }

    get password() {
        return this._password;
    }

    toJson() {
        return {
            "username": this._username,
            "img_url": this._imgURL
        };
    }

    static fromJSON(JSONUser) {
        return new User(JSONUser.username, JSONUser.img_url);
    }
}


class Message {
    constructor(from_username, to_username, text, timestamp) {
        this._fromUsername = from_username;
        this._toUsername = to_username;
        this._text = text;
        this._timestamp = timestamp
    }

    get fromUsername() {
        return this._fromUsername;
    }

    get toUsername() {
        return this._toUsername;
    }

    get text() {
        return this._text;
    }

    get timestamp() {
        return this._timestamp;
    }

    isSentMessage() {
        return this._fromUsername === CURRENT_USER.username
    }

    toJson() {
        return {
            "from_username": this._fromUsername,
            "to_username": this._toUsername,
            "text": this._text,
            "timestamp": this._timestamp
        };
    }


    static fromJSON(JSONMessage) {
        return new Message(JSONMessage.from_username, JSONMessage.to_username, JSONMessage.text, JSONMessage.timestamp);
    }
}


class Chat {
    constructor(to, messages) {
        this._to = to;
        this._messages = messages;
        this._messages.sortMessage = function () {
            this.sort((message1, message2) => {
                    return message1.timestamp - message2.timestamp
                }
            )
        };
        this._messages.sortMessage();
    }

    addMessage(message) {
        this._messages.push(message);
        this._messages.sortMessage();
    }

    get to() {
        return this._to;
    }

    get messages() {
        return this._messages;
    }

    get lastMessage() {
        return this._messages[this._messages.length - 1]
    }

    toJson() {
        const messagesJson = [];
        this._messages.forEach(message =>
            messagesJson.push(message.toJson())
        );

        const toUserJson = this.to.toJson();

        return {
            "to_user": toUserJson,
            "messages": messagesJson
        };
    }

    static fromJSON(JSONChat) {
        const messages = [];
        const to = User.fromJSON(JSONChat.to_user);
        JSONChat.messages.forEach(JSONMessage => {
            messages.push(Message.fromJSON(JSONMessage));
        });

        return new Chat(to, messages);
    }

    clone(){
        return Chat.fromJSON(this.toJson(this));
    }
}


if (typeof module !== 'undefined') {
    module.exports = {
        User: User,
        Message: Message,
        Chat: Chat
    }
}
