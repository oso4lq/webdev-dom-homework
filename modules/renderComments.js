const listElement = document.getElementById("comments");
const textInputElement = document.getElementById("comment-text-input");

export const renderComments = (comments) => {
    listElement.innerHTML = comments.map((comment, index) => {
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

    initiateLikeButtonListeners(comments);
    initiateReplyListeners(comments);
    initiateEditSaveListeners(comments);
};

const initiateLikeButtonListeners = (comments) => {
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

            renderComments(comments);
        });
    }
};

const initiateReplyListeners = (comments) => {
    const commentBoxElements = document.querySelectorAll(".comment");

    for (const commentBoxElement of commentBoxElements) {
        commentBoxElement.addEventListener("click", () => {
            const index = commentBoxElement.dataset.index;
            textInputElement.value = `> ${comments[index].text} \n ${comments[index].author}, `;
            //console.log('commentBoxElement clicked');
        })
    };
};

const initiateEditSaveListeners = (comments) => {
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
            renderComments(comments);
        });
    });
};