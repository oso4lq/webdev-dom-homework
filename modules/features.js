//  Features, application functionality

import { commentsArray, renderComments } from "./api.js";

//const nameInputElement = document.getElementById("comment-name-input");
//const textInputElement = document.getElementById("comment-text-input");

const initiateLikeButtonListeners = () => {
    const likeButtonElements = document.querySelectorAll(".like-button");

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener("click", (event) => {
            event.stopPropagation();

            const index = likeButtonElement.dataset.index;

            if (commentsArray[index].isLiked) {
                //console.log('element unliked');
                commentsArray[index].likes--;
                commentsArray[index].isLiked = false;
            } else {
                //console.log('element liked');
                commentsArray[index].likes++;
                commentsArray[index].isLiked = true;
            }

            //renderComments(commentsArray);
            renderComments();

        });
    }
};

const initiateReplyListeners = () => {
    const commentBoxElements = document.querySelectorAll(".comment");
    const textInputElement = document.getElementById("comment-text-input");

    for (const commentBoxElement of commentBoxElements) {
        commentBoxElement.addEventListener("click", () => {
            console.log(commentBoxElement);
            const index = commentBoxElement.dataset.delete;
            console.log(index);
            textInputElement.value = `> ${commentsArray[index].text} \n ${commentsArray[index].author}, `;
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
                commentsArray[index].isEdit = true;
                //console.log('comment editing');
            } else if (button.classList.contains("save-btn")) {
                const index = button.dataset.index;
                const textarea = document.getElementById(`textarea-${index}`);
                commentsArray[index].text = textarea.value;
                commentsArray[index].isEdit = false;
                //console.log('comment saved');
            }
            renderComments();
        });
    });
};

const validationButton = () => {
    const nameInputElement = document.getElementById("comment-name-input");
    const textInputElement = document.getElementById("comment-text-input");
    const buttonElement = document.getElementById("comment-button");

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

const inputByEnter = () => {
    document.addEventListener("keyup", (event) => {
        if (event.key === "Enter")
            document.querySelector(".add-form-row .add-form-button").click();
    });
};

export { initiateLikeButtonListeners, initiateReplyListeners, initiateEditSaveListeners, validationButton, inputByEnter }