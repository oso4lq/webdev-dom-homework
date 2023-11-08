const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

export const validationFields = () => {
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