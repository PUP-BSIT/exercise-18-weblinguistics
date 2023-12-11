function navigateToCountries() {
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    const commentButton = document.getElementById('comment_button');
    const commentText = document.getElementById('comment_text');
    const commentsContainer = document.getElementById('comments');
    const sortSelect = document.getElementById('sort');

    commentButton.addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const comment = commentText.value;

        if (name && comment) {
            const newComment = document.createElement('div');
            newComment.className = 'comment-container';

            const timestamp = new Date().toLocaleString();
            newComment.setAttribute('data-timestamp', timestamp);

            newComment.innerHTML = '<strong>Name: ' + name + 
			'</strong><br>' + comment + '<br><br>';

            commentsContainer.appendChild(newComment);

            document.getElementById('name').value && commentText.value;

            sortComments(commentsContainer, sortSelect.value);
        }
    });

    sortComments(commentsContainer, 'desc');
    sortSelect.addEventListener('change', function () {
        sortComments(commentsContainer, sortSelect.value);
    });

    function sortComments(container, order) {
        const commentNodes = 
		container.querySelectorAll('.comment-container');
        const commentsArray =
		Array.from(commentNodes);

        commentsArray.sort(function (a, b) {
            const timestampA = new Date
			(a.getAttribute('data-timestamp'));
            const timestampB = new Date
			(b.getAttribute('data-timestamp'));

            if (order === 'asc') {
                return timestampA - timestampB;
            } else {
                return timestampB - timestampA;
            }
        });

        container.innerHTML;

        commentsArray.forEach(function (commentNode) {
            container.appendChild(commentNode);
        });
    }
});