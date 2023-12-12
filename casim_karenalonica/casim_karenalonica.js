function navigateToCountries() {
    window.location.href = "countries.html";
}

document.addEventListener('DOMContentLoaded', function () {
const sortSelect = document.getElementById('sort');
const commentsContainer = document.getElementById
    ('comments_container');
const teammateCommentsHeader = 
    commentsContainer.querySelector('h2');
const commentButton = document.getElementById('comment_button');
const nameInput = document.getElementById('name');
const commentTextInput = document.getElementById('comment_text');

const SORT_ASCENDING = 'asc';
const SORT_DESCENDING = 'desc';

function sortComments(order) {
    const comments = Array.from(commentsContainer.children);
    comments.shift();

    comments.sort(function(a, b) {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));

        return order === SORT_ASCENDING ? 
            dateA - dateB : dateB - dateA;
    });

    while (commentsContainer.firstChild) {
            commentsContainer.firstChild.remove();
    }

    commentsContainer.appendChild(teammateCommentsHeader);

    comments.forEach(function(comment) {
        commentsContainer.appendChild(comment);
    });
}

sortComments(sortSelect.value);

sortSelect.addEventListener('change', function () {
    sortComments(sortSelect.value);
});

commentButton.addEventListener('click', function () {
    const name = nameInput.value.trim();
    const commentText = commentTextInput.value.trim();

    if (name && commentText) {
        const newComment = document.createElement('div');
        newComment.setAttribute('data-date', getCurrentDate());
        newComment.innerHTML = `<p><strong>Name:</strong> ${name}</p> 
            <p>${commentText}</p>`;

        commentsContainer.appendChild(newComment);

        nameInput.value = "";
        commentTextInput.value = "";

        sortComments(sortSelect.value);
    }
});

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    return `${year}-${month < 10 ? '0' + month : month}-${day 
        < 10 ? '0' + day : day}`;
}
});