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

    static fromJSON(JSONUser) {
        return new User(JSONUser._username, JSONUser._imgURL);
    }
}


class Message {
    constructor(from_username, to_username, text, timestamp) {
        this._from_username = from_username;
        this._to_username = to_username;
        this._text = text;
        this._timestamp = timestamp
    }

    get from() {
        return this._from_username;
    }

    get to() {
        return this._to_username;
    }

    get text() {
        return this._text;
    }

    get timestamp() {
        return this._timestamp;
    }

    isSentMessage() {
        return this._from_username === CURRENT_USER.username
    }

    toJson() {
        return JSON.stringify(this);
    }
    //
    // static fromJSON(JSONMessage) {
    //     const from = User.fromJSON(JSONMessage._from);
    //     const to = User.fromJSON(JSONMessage._to)
    //     return new Message(JSONMessage._id, from, to, JSONMessage._text, JSONMessage._timestamp);
    // }
}


class Chat {
    constructor(to, messages) {
        this._to = to;
        this._messages = messages;
        this._messages.sortMessage = function () {
            this.sort((message1, message2) => {
                    return message2.timestamp - message1.timestamp
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
        return this._messages[0]
    }

    toJson() {
        return JSON.stringify(this);
    }
    //
    // static fromJSON(JSONChat) {
    //     const messages = [];
    //     JSONChat._messages.forEach(JSONMessage => {
    //         messages.push(Message.fromJSON(JSONMessage));
    //     });
    //
    //     const to = User.fromJSON(JSONChat._to);
    //     return new Chat(to, messages);
    // }
}


if (typeof module !== 'undefined') {
    module.exports = {
        User: User,
        Message: Message,
        Chat: Chat
    }
}
