class User {
    constructor(id, username, imgURL) {
        this._id = id;
        this._username = username;
        this._imgURL = imgURL;
    }

    get id() {
        return this._id;
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

    static fromJSON(JSONUser){
        return new User(JSONUser._id, JSONUser._username, JSONUser._imgURL);
    }
}


class Message {
    constructor(id, from, to, text, timestamp) {
        this._id = id;
        this._from = from;
        this._to = to;
        this._text = text;
        this._timestamp = timestamp
    }

    get id() {
        return this._id;
    }

    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    get text() {
        return this._text;
    }

    get timestamp() {
        return this._timestamp;
    }

    isSentMessage() {
        return this._from.id === CURRENT_USER.id
    }

    static fromJSON(JSONMessage){
        const from = User.fromJSON(JSONMessage._from);
        const to = User.fromJSON(JSONMessage._to)
        return new Message(JSONMessage._id, from, to, JSONMessage._text, JSONMessage._timestamp);
    }
}


class Chat {
    constructor(id, to, messages) {
        this._id = id;
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

    get id() {
        return this._id;
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

    static fromJSON(JSONChat){
        const messages = []
        JSONChat._messages.forEach(JSONMessage => {
            messages.push(Message.fromJSON(JSONMessage));
        })

        const to = User.fromJSON(JSONChat._to);
        return new Chat(JSONChat._id, to, messages);
    }
}


if (typeof module !== 'undefined') {
    module.exports = {
        User: User,
        Message: Message,
        Chat: Chat
    }
}
