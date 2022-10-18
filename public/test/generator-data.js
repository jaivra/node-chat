class Generator {
    constructor() {
        this.count = 0;
    }

    generate() {
        this.count += 1;
    }

}

class UserGenerator extends Generator {
    constructor() {
        super();
        this.imgURL = "https://cdn3.iconfinder.com/data/icons/one-piece-colored/48/Cartoons__Anime_One_Piece_Artboard_11-512.png";
    }

    generate() {
        super.generate();
        const username = "username-" + this.count;
        return new User(username, this.imgURL);
    }
}

class MessageGenerator extends Generator {
    constructor() {
        super();
        this.lastTimestamp = Date.now();

    }

    generate(from, to) {
        super.generate();
        const count = this.count;

        const id = "id-" + count;
        const text = "text-" + count;
        this.lastTimestamp += 100;
        const timestamp = this.lastTimestamp;
        return new Message(id, from, to, text, timestamp);
    }
}

class ChatGenerator extends Generator {
    generate(to) {
        super.generate();
        const count = this.count;

        const id = "id-" + count;
        return new Chat(id, to, [])
    }
}

class DataGenerator {
    constructor() {
        this._userGenerator = new UserGenerator();
        this._messageGenerator = new MessageGenerator();
        this._chatGenerator = new ChatGenerator();
    }

    generateUser() {
        return this._userGenerator.generate();
    }

    generateMessage(from, to) {
        return this._messageGenerator.generate(from, to)
    }

    generateChat(to) {
        return this._chatGenerator.generate(to)
    }


    generateCompleteChat(currentUser, messageCount = 10) {
        const to = this.generateUser();
        const chat = this.generateChat(to);
        for (let i = 0; i < messageCount; i++) {
            chat.addMessage(this.generateMessage(to, currentUser));
            chat.addMessage(this.generateMessage(currentUser, to));
        }
        return chat;
    }


    generateCompleteChats(currentUser, chatCount = 10) {
        const chats = [];
        for (let i = 0; i < chatCount; i++) {
            const chat = this.generateCompleteChat(currentUser);

            chats.push(chat);
        }
        return chats;
    }
}


if (typeof module !== 'undefined') {
    module.exports = DataGenerator
}