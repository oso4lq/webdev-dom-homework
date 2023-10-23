"use strict";

const listElement = document.getElementById("comments");
const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

const comments = [
    {
        userName: 'Глеб Фокин',
        timeWritten: '12.02.2022 12:18',
        userText: 'Это будет первый комментарий на этой странице',
        likesCounter: 3,
        likesActive: false,
        isEdit: false
    },
    {
        userName: 'Варвара Н.',
        timeWritten: '13.02.2022 19:22',
        userText: 'Мне нравится как оформлена эта страница! ❤',
        likesCounter: 75,
        likesActive: true,
        isEdit: false
    },
];

const getCurrentDate = () => {
    const date = new Date().toLocaleString().slice(0, -3);
    return date;
};

const renderComments = () => {
    listElement.innerHTML = comments.map((comment, index) => {
        const quoteText = comment.userText.replace(/&gt; /g, '<div class="quote">').replace(/, /g, '</div><br>');

        const editButtonHtml = comment.isEdit
            ? `<button data-index='${index}' type='button' class='save-btn'>Сохранить</button>`
            : `<button data-index='${index}' type='button' class='edit-btn'>Редактировать</button>`;

        const commentTextHtml = comment.isEdit
            ? `<textarea data-index='${index}' id="textarea-${index}" class="edit-textarea">${comment.userText}</textarea>`
            : `<div class="comment-text">${quoteText}</div>`;

        return `
            <li data-index="${index}" class="comment">
                <div class="comment-header">
                    <div>${comment.userName}</div>
                    <div>${comment.timeWritten}</div>
                </div>
                <div class="comment-body">
                    ${commentTextHtml}
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likesCounter}</span>
                        <button data-index="${index}" class="like-button ${comment.likesActive ? '-active-like' : ''}"></button>
                    </div>
                    ${editButtonHtml}
                </div>
            </li>`;
    }).join("");

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

            if (comments[index].likesActive) {
                //console.log('element unliked');
                comments[index].likesCounter--;
                comments[index].likesActive = false;
            } else {
                //console.log('element liked');
                comments[index].likesCounter++;
                comments[index].likesActive = true;
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
            textInputElement.value = `> ${comments[index].userText} \n ${comments[index].userName}, `;
            //console.log('commentBoxElement clicked');
        })};
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
                comments[index].userText = textarea.value;
                comments[index].isEdit = false;
                //console.log('comment saved');
            }
            renderComments();
        });
    });
};

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

nameInputElement.addEventListener("input", validationFields);
textInputElement.addEventListener("input", validationFields);

buttonElement.addEventListener("click", () => {
    if (nameInputElement.value !== "" && textInputElement.value !== "") {
        comments.push({
            userName: nameInputElement.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
            timeWritten: getCurrentDate(),
            userText: textInputElement.value.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
            likesCounter: 0,
            likesActive: false
        });

        renderComments();

        nameInputElement.value = "";
        textInputElement.value = "";
        //console.log('comment added');
    }
});

renderComments();