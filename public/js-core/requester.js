class Requester {
    constructor() {
        this._timestampRequest = 0;
        this._requestPeriodicTime = 500;
        this._observers = [];

        const url = window.location.href;
        const tokens = url.split("/");
        this.baseURL = tokens[0] + "//" + tokens[2] + "/";

    }

    existsUser(username, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200)
                callback(true);
            else if (httpRequest.readyState === 4 && httpRequest.status === 404)
                callback(false);

        };
        const params = 'username=' + username;
        httpRequest.open('GET', this.baseURL + "api/users/exists?" + params, true);
        httpRequest.send();
    }

    loginUser(username, password, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                const userData = JSON.parse(httpRequest.responseText);
                const currentUser = User.fromJSON(userData);
                callback(currentUser)
            } else if (httpRequest.readyState === 4 && httpRequest.status === 404)
                callback(null);

        };
        const params = 'username=' + username + "&" + "password=" + password;
        httpRequest.open('POST', this.baseURL + "api/users/login", true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        httpRequest.send(params);
    }

    signUpUser(username, password, imgURL, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 201)
                callback(true);
            else if (httpRequest.readyState === 4 && httpRequest.status === 400)
                callback(false);
        };
        const params = 'username=' + username + "&" + "password=" + password + "&" + "img_url=" + imgURL;
        httpRequest.open('POST', this.baseURL + "api/users/sign_up", true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        httpRequest.send(params);
    }

    addObserver(observer) {
        this._observers.push(observer);
    }


    start() {
        this.chatRequest();
        window.setInterval(this.chatRequest.bind(this), this._requestPeriodicTime);
    }

    chatRequest() {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                const chatsData = JSON.parse(httpRequest.responseText);
                const chats = [];
                chatsData.forEach(chatData => {
                    chats.push(Chat.fromJSON(chatData));
                });
                if (chats.length > 0)
                    this._observers.forEach(observer => observer.onUpdateChat(chats));
            }

        }.bind(this);
        const params = 'username=' + CURRENT_USER.username + "&" + "timestamp=" + this._timestampRequest;
        httpRequest.open('GET', this.baseURL + "api/messages?" + params, true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this._timestampRequest = Date.now();
        httpRequest.send(params);
    }

    sendMessage(usernameTo, text) {
        const timestamp = Date.now();

        const httpRequest = new XMLHttpRequest();

        const params = 'username_from=' + CURRENT_USER.username + "&" + "username_to=" + usernameTo + "&" + "timestamp=" + timestamp + "&" + "text=" + text;
        httpRequest.open('POST', this.baseURL + "api/messages?" + params, true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        this._timestampRequest = Date.now();
        httpRequest.send(params);
    }


    listUser(query, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                const usernamesData = JSON.parse(httpRequest.responseText);
                const users = [];
                usernamesData.forEach(usernameData => {
                    users.push(User.fromJSON(usernameData));
                });
                callback(users, query);
            }
            // else if (httpRequest.status === 404)
            //     callback(false);

        };
        const params = 'username=' + CURRENT_USER.username + "&" + "q=" +query;
        httpRequest.open('GET', this.baseURL + "api/users/list?" + params, true);
        httpRequest.send();
    }
}


const REQUESTER = new Requester();
// REQUESTER.loginUser("valee", "prova");