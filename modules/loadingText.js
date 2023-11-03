import { getCommentsAPI } from './main.js';

export const loadingText = () => {
    document.getElementById("comments").style.display = 'none';
    document.getElementById("comment-wait").style.display = 'block';
    getCommentsAPI()
        .then(() => {
            document.getElementById("comments").style.display = 'flex';
            document.getElementById("comment-wait").style.display = 'none';
        });
};