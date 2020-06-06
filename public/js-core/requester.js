class Requester {
    existsUser(username, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.status === 200)
                callback(true);
            else if (httpRequest.status === 404)
                callback(false);

        };
        const params = 'username=' + username;
        httpRequest.open('GET', 'http://localhost:3000/api/users/exists?' + params, true);
        httpRequest.send();
    }

    loginUser(username, password, callback) {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.status === 200){
                // callback(true);
                const data = JSON.parse(httpRequest.responseText);
                console.log(data);
                // const loggedUser = new User(data.username, data.)
            }
            // else if (httpRequest.status === 404)
            //     callback(false);

        };
        const params = 'username=' + username + "&" + "password=" + password;
        httpRequest.open('POST', 'http://localhost:3000/api/users/login', true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        httpRequest.send(params);
    }
}


const REQUESTER = new Requester();
REQUESTER.loginUser("valee", "prova");