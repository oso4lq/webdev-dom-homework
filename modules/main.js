"use strict";

import { getNetworkDate } from './getDate.js';
import { getCommentsAPICore, retryPostComment } from './api.js';
import { renderComments } from './renderComments.js';
import { validationFields } from './validation.js';
import { loadingText } from './loadingText.js';

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

loadingText();

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