//  API operations
//
//import { getCommentsAPI } from './main.js';

const nameInputElement = document.getElementById("comment-name-input");
const textInputElement = document.getElementById("comment-text-input");
const buttonElement = document.getElementById("comment-button");

const errorShortInputElement = document.getElementById("error-short-input");
const errorNoNetworkElement = document.getElementById("error-no-network");
const errorServerDownElement = document.getElementById("error-server-down");

export let token;
export const setToken = (newToken) => {
    token = newToken;
}

const commentsURL = "https://wedev-api.sky.pro/api/v2/oso4/comments";
const userURL = "https://wedev-api.sky.pro/api/user/login";

const login = (userLogin, userPassword) => {
    return fetch(userURL, {
        method: "POST",
        body: JSON.stringify(userLogin, userPassword),
    }).then((response) => response.json());
}

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

export { getCommentsAPICore, retryPostComment, login }