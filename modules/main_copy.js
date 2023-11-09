"use strict";

import { getNetworkDate } from './getDate.js';
import { getCommentsAPICore } from './api.js';
import { renderLogin } from './renderLogin.js';

const listElement = document.getElementById("comments");
const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");
const commentWaitElement = document.getElementById("comment-wait");
const errorShortInputElement = document.getElementById("error-short-input");
const errorNoNetworkElement = document.getElementById("error-no-network");
const errorServerDownElement = document.getElementById("error-server-down");
const appElement = document.getElementById("app");


let comments = [];

const renderComments = () => {
    //before
    //listElement.innerHTML 
    //after
    const commentsHTML = comments.map((comment, index) => {
        const quoteText = comment.text.replace(/&gt; /g, '<div class="quote">').replace(/, /g, '</div><br>');

        const editButtonHtml = comment.isEdit
            ? `<button data-index='${index}' type='button' class='save-btn'>Сохранить</button>`
            : `<button data-index='${index}' type='button' class='edit-btn'>Редактировать</button>`;

        const commentTextHtml = comment.isEdit
            ? `<textarea data-index='${index}' id="textarea-${index}" class="edit-textarea">${comment.text}</textarea>`
            : `<div class="comment-text">${quoteText}</div>`;

        return `
            <li data-index="${index}" class="comment">
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
                </div>
            </li>`;
    }).join("");

    const appHTML = `
    <div class="container">
<ul id="comments" class="comments">${commentsHTML}
</ul>
<div class="add-form">
  <input type="text" class="add-form-name" id="comment-name-input" placeholder="Введите ваше имя" />
  <textarea type="textarea" class="add-form-text" id="comment-text-input" placeholder="Введите ваш коментарий"
    rows="4"></textarea>
  <div id="button-box" class="add-form-row">

    <div class="error-box" id="error-short-input">Поля ввода должны содержать минимум 3 символа.</div>
    <div class="error-box" id="error-no-network">Соединение с Интернетом потеряно.<br>Повторная попытка через 5
      секунд.</div>
    <div class="error-box" id="error-server-down">Соединение с сервером потеряно.<br>Повторная попытка через 5
      секунд.</div>

    <button class="add-form-button-active" id="comment-button">Написать</button>
  </div>
</div>
<a href="login.html" id="link-to-login">Войти / Зарегистрироваться</a>
<div id="app"></div>
</div>
`;

    appElement.innerHTML = appHTML;

    initiateLikeButtonListeners();
    initiateReplyListeners();
    initiateEditSaveListeners();

};

const initiateLikeButtonListeners = () => {
    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", (event) => {
            event.stopPropagation();

            const index = likeButtonElement.dataset.index;

            if (comments[index].isLiked) {
                //console.log('element unliked');
                comments[index].likes--;
                comments[index].isLiked = false;
            } else {
                //console.log('element liked');
                comments[index].likes++;
                comments[index].isLiked = true;
            }

            renderComments();
        });
    }
};

const initiateReplyListeners = () => {
    const commentBoxElements = document.querySelectorAll(".comment");

    for (const commentBoxElement of commentBoxElements) {
        commentBoxElement.addEventListener("click", () => {
            const index = commentBoxElement.dataset.index;
            textInputElement.value = `> ${comments[index].text} \n ${comments[index].author}, `;
            //console.log('commentBoxElement clicked');
        })
    };
};

const initiateEditSaveListeners = () => {
    const buttons = document.querySelectorAll(".edit-btn, .save-btn");

    buttons.forEach((button, index) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (button.classList.contains("edit-btn")) {
                comments[index].isEdit = true;
                //console.log('comment editing');
            } else if (button.classList.contains("save-btn")) {
                const index = button.dataset.index;
                const textarea = document.getElementById(`textarea-${index}`);
                comments[index].text = textarea.value;
                comments[index].isEdit = false;
                //console.log('comment saved');
            }
            renderComments();
        });
    });
};

const getCommentsAPI = () => {
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
        renderComments();
    });
}

const loadingText = () => {
    document.getElementById("comments").style.display = 'none';
    document.getElementById("comment-wait").style.display = 'block';
    //console.log('loading comments');
    getCommentsAPI()
        .then(() => {
            //console.log('comments loaded');
            document.getElementById("comments").style.display = 'flex';
            document.getElementById("comment-wait").style.display = 'none';
        });
};
//loadingText();
getCommentsAPI();

renderLogin();



const validationFields = () => {
    if (nameInputElement.value && textInputElement.value) {
        buttonElement.classList.remove("add-form-button-inactive-hover");
        buttonElement.disabled = false;
        nameInputElement.classList.remove("error");
        textInputElement.classList.remove("error");
        return;
    }

    if (!nameInputElement.value) {
        nameInputElement.classList.add("error");
    } else {
        nameInputElement.classList.remove("error");
    }

    if (!textInputElement.value) {
        textInputElement.classList.add("error");
    } else {
        textInputElement.classList.remove("error");
    }

    buttonElement.classList.add("add-form-button-inactive-hover");
    buttonElement.disabled = true;
};

const sanitizeInput = (input) => input.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

nameInputElement.addEventListener("input", validationFields);
textInputElement.addEventListener("input", validationFields);


buttonElement.addEventListener("click", () => {
    if (nameInputElement.value !== "" && textInputElement.value !== "") {

        buttonElement.disabled = true;
        buttonElement.textContent = 'Добавление...';

        const retryPostComment = () => {
            fetch("https://wedev-api.sky.pro/api/v1/oso4/comments", {
                method: "POST",
                body: JSON.stringify({
                    name: sanitizeInput(nameInputElement.value),
                    text: sanitizeInput(textInputElement.value),
                    forceError: true,
                }),
            })
                .then(postResponceAnalysis)
                .then(() => getCommentsAPI())
                .then(() => {
                    buttonElement.disabled = false;
                    buttonElement.textContent = 'Написать';
                    nameInputElement.value = "";
                    textInputElement.value = "";
                })
                .catch(postErrorAnalysis);

            function postResponceAnalysis(response) {
                if (nameInputElement.value.length < 3 || textInputElement.value.length < 3) {
                    errorShortInputElement.style.display = 'flex';
                    setTimeout(() => {
                        errorShortInputElement.style.display = 'none';
                    }, 5000);
                    throw new Error("Field inputs must be at least 3 characters long");
                };
                if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error("Server is down");
                };
            };

            function postErrorAnalysis(error) {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Написать';
                console.warn(error);

                if (error instanceof Error) {
                    switch (error.message) {
                        case "Failed to fetch":
                            errorNoNetworkElement.style.display = 'flex';
                            break;
                        case "Server is down":
                            errorServerDownElement.style.display = 'flex';
                            break;
                        default:
                            break;
                    }

                    buttonElement.disabled = true;
                    buttonElement.textContent = 'Добавление...';

                    if (error.message !== "Field inputs must be at least 3 characters long") {
                        setTimeout(() => {
                            retryPostComment();
                            switch (error.message) {
                                case "Failed to fetch":
                                    errorNoNetworkElement.style.display = 'none';
                                    break;
                                case "Server is down":
                                    errorServerDownElement.style.display = 'none';
                                    break;
                                default:
                                    break;
                            }
                        }, 5000);
                    } else {
                        buttonElement.disabled = false;
                        buttonElement.textContent = 'Написать';
                    }
                }
                return error;
            };
        };
        retryPostComment();

        //console.log('comment added');
    }
});