"use strict";

import { getNetworkDate } from './getDate.js';
import { getCommentsAPICore, retryPostComment } from './api.js';
import { renderComments } from './renderComments.js';
import { validationFields } from './validationFields.js';
import { loadingText } from './loadingText.js';
import { renderLogin } from "./renderLogin.js";

const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

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
/*
const loadingText = () => {
    document.getElementById("comments").style.display = 'none';
    document.getElementById("comment-wait").style.display = 'block';
    getCommentsAPI()
        .then(() => {
            document.getElementById("comments").style.display = 'flex';
            document.getElementById("comment-wait").style.display = 'none';
        });
};*/


// later add loadingText once again, now it's switched off and replaced with
// simple loading comments
//loadingText();
getCommentsAPI();
renderLogin();


/*
validationFields();
nameInputElement.classList.remove("error");
textInputElement.classList.remove("error");
nameInputElement.addEventListener("input", validationFields);
textInputElement.addEventListener("input", validationFields);
*/

buttonElement.addEventListener("click", () => {
    buttonElement.disabled = true;
    buttonElement.textContent = 'Добавление...';
    retryPostComment();
});