if (localStorage.getItem("current_user"))
    userLogged();

const usernameLogin = document.getElementById("user_login");
const passwordLogin = document.getElementById("password_login");

const usernameSignUp = document.getElementById("user_sign_up");
const password1SignUp = document.getElementById("password1_sign_up");
const password2SignUp = document.getElementById("password2_sign_up");
const imgURL = document.getElementById("img_url_sign_up");

const loginButton = document.getElementById("login_button");
const signUpButton = document.getElementById("sign_up_button");

usernameLogin.onchange = function () {
    const value = usernameLogin.value;
    usernameLoginValid = value !== "";
};

passwordLogin.onchange = function () {
    const value = passwordLogin.value;
    passwordLoginValid = value !== "";
};

usernameSignUp.onchange = function () {
    const onResponse = function (exists) {
        usernameSignUpValid = !exists;
        if (exists)
            showViewMessage(usernameErrorMessage);
        else
            removeViewMessage(usernameErrorMessage);

    };
    const value = this.value;
    REQUESTER.existsUser(value, onResponse);
};

password1SignUp.onchange = function () {
    const value = password1SignUp.value;
    password1SignUpValid = value !== "";
};


password2SignUp.onchange = function () {
    const value = password2SignUp.value;
    password2SignUpValid = value !== "";
};

let usernameLoginValid = false;
let passwordLoginValid = false;
let usernameSignUpValid = false;
let password1SignUpValid = false;
let password2SignUpValid = false;


loginButton.onclick = function () {
    const onLoginResponse = function (user) {
        if (user !== null) {
            console.log("--", user);
            localStorage.setItem('current_user', JSON.stringify(user.toJson()));
            userLogged();
        }
    };
    if (usernameLoginValid && passwordLoginValid) {
        const username = usernameLogin.value;
        const password = passwordLogin.value;
        REQUESTER.loginUser(username, password, onLoginResponse);
    }
};

signUpButton.onclick = function () {
    const onSignUpResponse = function (success) {
        if (success)
            showViewMessage(userSuccessMessage, true);
        else
            showViewMessage(userErrorMessage, true);

    };
    if (usernameSignUpValid && password1SignUpValid && password2SignUpValid) {
        const username = usernameSignUp.value;
        const password1 = password1SignUp.value;
        const password2 = password2SignUp.value;
        const img = imgURL.value !== undefined ? imgURL.value : "";

        if (password1 !== password2)
            showViewMessage(passwordErrorMessage, true);
        else
            REQUESTER.signUpUser(username, password1, img, onSignUpResponse);
    }
};


function userLogged() {
    const currentURL = document.URL;
    const tokens = currentURL.split("/");
    tokens.pop();
    const newURL = tokens.join("/");
    window.location.replace(newURL);
}


const usernameErrorMessage = document.getElementById("usernameErrorMessage");
const passwordErrorMessage = document.getElementById("passwordErrorMessage");
const userErrorMessage = document.getElementById("userErrorMessage");
const userSuccessMessage = document.getElementById("userSuccessMessage");

function showViewMessage(elementId, temporized = false) {
    elementId.style.display = "block";
    if (temporized)
        setTimeout(_ => elementId.style.display = "none", 2500);
}

function removeViewMessage(elementId) {
    elementId.style.display = "none";
}