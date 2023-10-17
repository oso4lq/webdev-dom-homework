"use strict";

const listElement = document.getElementById("comments");
const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");

const buttonElement = document.getElementById("comment-button");
const buttonBox = document.getElementById("button-box");

const commentElements = document.querySelectorAll(".comment");

const comments = [
    {
        userName: 'Глеб Фокин',
        timeWritten: '12.02.2022 12:18',
        userText: 'Это будет первый комментарий на этой странице',
        likesCounter: 3,
        likesActive: false
    },
    {
        userName: 'Варвара Н.',
        timeWritten: '13.02.2022 19:22',
        userText: 'Мне нравится как оформлена эта страница! ❤',
        likesCounter: 75,
        likesActive: true
    },
];


const getCurrentDate = () => {
    let date = new Date().toLocaleDateString();
    let time = new Date().toLocaleTimeString().slice(0, -3);
    return `${date} ${time}`;
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
        commentBoxElement.addEventListener("click", (event) => {
            event.stopPropagation();

            const index = commentBoxElement.dataset.index;

            textInputElement.value = `> ${comments[index].userText} 
            
${comments[index].userName}, `;

            //console.log('commentBoxElement clicked');
        });
    };
};


const renderComments = () => {
    const commentsHtml = comments.map((comment, index) => {
        return `<li data-index="${index}" class="comment">
            <div class="comment-header">
              <div>${comment.userName}</div>
              <div>${comment.timeWritten}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${comment.userText}
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likesCounter}</span>
                <button data-index="${index}" class="like-button ${comment.likesActive ? '-active-like' : ''}"></button>
              </div>
            </div>
          </li>`
    }).join("");

    listElement.innerHTML = commentsHtml;

    initiateLikeButtonListeners();
    initiateReplyListeners();
};

renderComments();

buttonElement.addEventListener("click", () => {
    nameInputElement.classList.remove("input-error");

    if (nameInputElement.value === "") {
        nameInputElement.classList.add("input-error");
        return;
    }

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
});


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
    if (nameInputElement.value === "" || textInputElement.value === "") {
        return;
    }
});
//console.log("It works!");
