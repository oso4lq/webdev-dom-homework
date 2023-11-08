//  API operations
//
//import { getCommentsAPI } from './main.js';
import { initiateLikeButtonListeners, initiateReplyListeners, initiateEditSaveListeners, validationButton, inputByEnter } from "./features.js";
import { getNetworkDate } from "./getDate.js";

const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

const commentWaitElement = document.getElementById("comment-wait");
const commentUploadElement = document.getElementById("comment-upload");

const errorShortInputElement = document.getElementById("error-short-input");
const errorNoNetworkElement = document.getElementById("error-no-network");
const errorServerDownElement = document.getElementById("error-server-down");

const commentsURL = "https://wedev-api.sky.pro/api/v2/oso4/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

let commentsArray = [];

export let token;
console.log(token);
export const setUserToken = (newToken) => {
    token = newToken;
};

export let name;
console.log(name);
export const setUserName = (newName) => {
    name = newName;
};

export let id;
console.log(id);
export function setUserId(newId) {
    id = newId;
};

const login = (userLogin, userPassword) => {
    return fetch(userURL, {
        method: "POST",
        body: JSON.stringify(userLogin, userPassword),
    }).then((responseData) => {
        if (responseData.status === 201) {
            return responseData.json();
        } else if (responseData.status === 400) {
            throw new Error("Incorrect login or password");
        }
    }).catch((error) => {
        if (error.message === "Incorrect login or password") {
            console.log('Incorrect login or password');
            alert('Incorrect login or password!')
        }
    })
}

// fetch GET from API
export const getComments = () => {
    return fetch(commentsURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            commentWaitElement.style.display = "none";
            return response;
        })
        .then((responseData) => {


            commentsArray = responseData.comments.map((comment) => {
                return {
                    author: comment.author.name,
                    date: getNetworkDate(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                    isEdit: false,

                    id: comment.id,
                };
            });

            renderComments();

            console.log(commentsArray);
        })
};

const sanitizeInput = (input) => input.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const retryPostComment = () => {
    fetch(commentsURL, {
        method: "POST",
        body: JSON.stringify({
            name: sanitizeInput(nameInputElement.value),
            text: sanitizeInput(textInputElement.value),
            forceError: true,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
        switch (true) {
            case nameInputElement.value.length < 3 || textInputElement.value.length < 3:
                errorShortInputElement.style.display = 'flex';
                setTimeout(() => {
                    errorShortInputElement.style.display = 'none';
                }, 5000);
                throw new Error("Field inputs must be at least 3 characters long");

            case response.status === 201:
                return response.json();

            default:
                throw new Error("Server is down");
        }
    }

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

// add to array and render function
const renderComments = () => {
    const appElement = document.querySelector("#app");
    const сommentsArrayHTML = commentsArray
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
        <!--<div id="load" class="text-load">
            <p>Обновление списка комментариев. Пожалуйста подождите.</p>
        </div>-->

        <ul class="comments">
            ${сommentsArrayHTML}
        </ul>

        <br>

        <div style="display: none; color: rgb(255, 255, 255)" class="loading-add">
            <p>Комментарий добавляется...</p>
        </div>

        <div id="add-form" class="add-form">
            <input value="${name}" readonly id="comment-name-input" type="text" class="add-form-name" placeholder="Введите ваше имя" />
            <textarea
                type="textarea"
                class="add-form-text"
                id="comment-text-input"
                placeholder="Введите ваш коментарий"
                rows="4">
            </textarea>

            <div class="add-form-row">
                <button class="add-form-button-active" id="comment-button">Написать</button>
            </div>
            
        </div>`;
    appElement.innerHTML = appHTML;


    initiateLikeButtonListeners();
    initiateReplyListeners();
    initiateEditSaveListeners();

    inputByEnter();

    //validationButton();

    const nameInputElement = document.getElementById("comment-name-input");
    const textInputElement = document.getElementById("comment-text-input");
    //const inputName = document.getElementById("comment-name-input");
    //const inputComments = document.getElementById("comment-text-input");
    const button = document.getElementById("comment-button");

    button.addEventListener("click", () => {
        console.log(1);
        nameInputElement.classList.remove("error");
        if (nameInputElement.value === "") {
            nameInputElement.classList.add("error");
        }
        textInputElement.classList.remove("error");
        if (textInputElement.value === "") {
            textInputElement.classList.add("error");
            return;
        }

        retryPostComment();

    });

    //inputComments.addEventListener("input", validationButton);

};























//  OLD
const getCommentsAPICore = () => {
    return fetch(commentsURL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error("No authorization");
            }
            return response.json()
        });
}

export { getCommentsAPICore, retryPostComment, login }

/*
// sample function for retry/post comments
const addComment = (name, text) => {
    return fetch(commentsURL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;"),
            name: name
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;"),
            forceError: true,
        }),
    });
};

// Метод fetch() запрос через API на добавление данных c сохранением на сервере комментарий в списке
const sedingsServer = () => {
    const formElements = document.getElementById("add-form");
    const inputName = document.getElementById("comment-name-input");
    const inputComments = document.getElementById("comment-text-input");
    const loadingElements = document.querySelector(".loading-add");
    loadingElements.style.display = "block";
    formElements.style.display = "none";

    // Функция addComment отдельно для передачи POST запроса
    addComment(inputName.value, inputComments.value)
        .then((response) => {
            return response;
        })
        // Создан отдельный then для реализации логики if/else и передачи исключений методом throw new Error() отлавливаем ошибки в catch()
        .then((responseData) => {
            if (responseData.status === 201) {
                return responseData.json();
            } else if (responseData.status === 400) {
                throw new Error("Не верный ввод");
            } else if (responseData.status === 500) {
                console.log(responseData.status);
                throw new Error("Сломался сервер");
            } else {
                throw new Error("Не работает интернет");
            }
        })
        .then(() => {
            return getComments(); // Вызов повторно метод GET в методе POST для того что бы добавлялся комментарий
        })
        .then(() => {
            button.disabled = true;
            inputName.value = "";
            inputComments.value = "";
            loadingElements.style.display = "none";
            formElements.style.display = "flex";
        })
        .catch((error) => {
            loadingElements.style.display = "none";
            formElements.style.display = "flex";
            if (error.message === "Не верный ввод") {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } else if (error.message === "Сломался сервер") {
                addCommentError();
            }
        });
};

// Функция повторного отправления запроса при 500 ошибки API
function addCommentError() {
    addComment(inputName.value, inputComments.value)
        .then((response) => {
            return response;
        }) // Создан отдельный then для реализации логики if/else и передачи исключений методом throw new Error() отлавливаем ошибки в catch()
        .then((responseData) => {
            console.log(responseData);
            if (responseData.status === 500) {
                throw new Error("Сломался сервер");
            } else {
                return responseData.json();
            }
        })
        .then(() => {
            return getComments();
        })
        .then(() => {
            button.disabled = true;
            inputName.value = "";
            inputComments.value = "";
            loadingElements.style.display = "none";
            formElements.style.display = "flex";
        })
        .catch((error) => {
            alert(
                "Кажется, что на сервере проблемы делаем повторный запрос!!!!!!!!!"
            );
            loadingElements.style.display = "block";
            formElements.style.display = "none";
            addCommentError();
        });
}
*/