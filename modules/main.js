"use strict";

import { getNetworkDate } from './getDate.js';
import { login, setUserToken, setUserName, setUserId, getComments } from './api.js';
/*import { getCommentsAPICore, retryPostComment } from './api.js';
import { renderComments } from './renderComments.js';
import { validationFields } from './validationFields.js';
import { loadingText } from './loadingText.js';
import { renderLogin } from "./renderLogin.js";*/

const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

const commentWaitElement = document.getElementById("comment-wait");
commentWaitElement.style.display = "block";



export const now = new Date();
const URL = "https://wedev-api.sky.pro/api/v2/oso4/comments";

export const loadPage = () => {
    return fetch(URL, {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            commentWaitElement.style.display = "none";
            return response;
        })
        .then((responseData) => {
            const comments = responseData.comments.map((comment) => {
                return {
                    author: comment.author.name,
                    date: getNetworkDate(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                    isEdit: false,
                };
            });

            console.log(comments);
            renderComments(comments)

        })
        .catch((error) => {
            console.error(error);
        });
};
loadPage();

const renderComments = (commentsArray) => {
    const appElement = document.querySelector("#app");
    const commentsArrayHTML = commentsArray
        .map((comment, index) => {

            const quoteText = comment.text.replace(/&gt; /g, '<div class="quote">').replace(/, /g, '</div><br>');

            const editButtonHtml = comment.isEdit
                ? `<button data-index='${index}' type='button' class='save-btn'>Сохранить</button>`
                : `<button data-index='${index}' type='button' class='edit-btn'>Редактировать</button>`;

            const commentTextHtml = comment.isEdit
                ? `<textarea data-index='${index}' id="textarea-${index}" class="edit-textarea">${comment.text}</textarea>`
                : `<div class="comment-text">${quoteText}</div>`;

            return `
                <li class="comment" data-delete="${index}">
                    <div class="comment-header">
                        <div>${comment.author}</div>
                        <div>${comment.date}</div>
                    </div>

                    <div class="comment-body">
                        ${commentTextHtml}
                    </div>

                    <div class="comment-footer">
                    
                        <div class="likes">
                            <span class="likes-counter">${comment.likes}</span>
                            <button data-index="${index}" class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
                        </div>
                
                    ${editButtonHtml}
                </li>`;
        }).join("");

    const appHTML = `  
    <ul class="comments">
        ${commentsArrayHTML}
    </ul>
    
    <br>
    
    <div>
        <a id="link" href="#">Авторизуйтесь</a>, чтобы оставить комментарий.
    </div>`;

    appElement.innerHTML = appHTML;

    // unnecessary because the user is not logged in
    //initiateLikeButtonListeners(commentsArray);
    //initiateReplyListeners(commentsArray);
    //initiateEditSaveListeners(commentsArray);

    document.getElementById('link').addEventListener('click', () => {
        renderLogin()
    })
}

function renderLogin() {
    const appElement = document.querySelector("#app");
    const loginHTML = `
    <div class="container">
        <div class="add-form">

            <h3>Войти / Зарегистрироваться</h3>
            <h4>osetr</h4>
            <h4>abirvalg</h4>

            <input
                id="login-input"
                type="text"
                class="add-form-name"
                placeholder="Введите ваш логин"
            />
            <br>
            <input
                id="login-password"
                type="text"
                class="add-form-name"
                placeholder="Введите ваш пароль"
            />

            <div class="add-form-row">
                <button id="login-button" class="add-form-button">Войти</button>
            </div>

        </div>
        
        <br>
        
        <div>
            <a id="linkBack" href="#">Вернуться</a> к комментариям</div>
        </div>
    </div>`;

    appElement.innerHTML = loginHTML;
    //console.log(appElement.innerHTML);

    document.querySelector("#linkBack").addEventListener("click", () => {
        loadPage()
    })
    const loginInputElement = document.querySelector("#login-input");
    const loginPasswordElement = document.querySelector("#login-password");
    const loginButtonElement = document.querySelector("#login-button");

    loginButtonElement.addEventListener("click", loginButton);

    function loginButton() {
        login({
            login: loginInputElement.value,
            password: loginPasswordElement.value,
        })
            .then((responseData) => {
                setUserToken(responseData.user.token);
                console.log(responseData.user.token);
                setUserName(responseData.user.name);
                console.log(responseData.user.name);
                setUserId(responseData.user._id)

            })
            .then(() => {
                getComments();
            })
    };
};






// OLD
/*
let comments = [];

    export const getCommentsAPI = () => {
        return getCommentsAPICore().then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    author: comment.author.name,
                    date: getNetworkDate(comment.date),
                    likes: comment.likes,
                    isLiked: false,
                    text: comment.text,
                };
            });
            renderComments(comments);
        });
    }
    
    const loadingText = () => {
        document.getElementById("comments").style.display = 'none';
        document.getElementById("comment-wait").style.display = 'block';
        getCommentsAPI()
            .then(() => {
                document.getElementById("comments").style.display = 'flex';
                document.getElementById("comment-wait").style.display = 'none';
            });
    };


    // later add loadingText once again, now it's switched off and replaced with
    // simple loading comments

    loadingText();
    //getCommentsAPI();
    renderLogin();


    
    validationFields();
    nameInputElement.classList.remove("error");
    textInputElement.classList.remove("error");
    nameInputElement.addEventListener("input", validationFields);
    textInputElement.addEventListener("input", validationFields);
    

    buttonElement.addEventListener("click", () => {
        buttonElement.disabled = true;
        buttonElement.textContent = 'Добавление...';
        retryPostComment();
    });
    */