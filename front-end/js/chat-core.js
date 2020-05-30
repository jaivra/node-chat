class User {
    constructor(id, name, imgURL) {
        this._id = id;
        this._username = name;
        this._imgURL = imgURL;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._username;
    }

    get imgURL() {
        return this._imgURL;
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

    get id(){
        return this._id;
    }

    get from(){
        return this._from;
    }

    get to(){
        return this._to;
    }

    get text() {
        return this._text;
    }

    get timestamp() {
        return this._timestamp;
    }

    isSentMessage(){
        return this.from.id === CURRENT_USER.id
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

    addMessage(message){
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
}


let CURRENT_USER;