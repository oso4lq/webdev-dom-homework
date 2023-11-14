// Script for authorization and registration

import { login, token, setToken } from './api.js'

export const renderLogin = () => {
    const appElement = document.getElementById("app")
    const loginHTML = `<h1>Страница входа</h1>
    <div class="form">
        <h3 class="form-title">Форма входа</h3>
        <div class="form-row">
            <input type="text" id="login-input" class="input" placeholder="Логин" />
            <input type="text" id="password-input" class="input" placeholder="Пароль" />
        </div>
        <br />
        <button class="button" id="login-button">Войти</button>
        <a href="index.html" id="link-to-login">Перейти к комментариям</a>
    </div>`
    appElement.innerHTML = loginHTML;


const buttonElement = document.getElementById("login-button");
const loginInputElement = document.getElementById("login-input");
const passwordInputElement = document.getElementById("password-input");

buttonElement.addEventListener("click", () => {
    console.log(loginInputElement.value);
    console.log(passwordInputElement.value);
    login({
        login: loginInputElement.value,
        password: passwordInputElement.value,
    }).then((responseData) => {
        //console.log(responseData);
        //console.log(token);
        //console.log(responseData.user.name);
        setToken(responseData.user.token);
        console.log(token);
    })
});
}