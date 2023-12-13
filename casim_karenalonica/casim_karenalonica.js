const backendUrl = "https://postify.tech/api_exercise18/casim_backend.php";

function getBooks() {
    fetch(backendUrl, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        displayBooks(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayBooks(books) {
    const bookList = document.getElementById('book_list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-entry');
        bookDiv.innerHTML = `
            <p>Title: 
                <p id="title_${book.id}">${book.title}</p><hr>
            </p>
            <p>Author: 
                <p id="author_${book.id}">${book.author}</p><hr>
            </p>
            <p>Publisher: 
                <p id="publisher_${book.id}">${book.publisher}</p><hr>
            </p>
            <p>Publication Year: 
                <p id="publication_year_${book.id}">
					${book.publication_year}</p><hr>
            </p>
            <p>Genre: 
                <p id="genre_${book.id}">${book.genre}</p><hr>
            </p>
            <button onclick="editBook(${book.id})">Edit</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        `;
        bookList.appendChild(bookDiv);
    });
}

function addBook() {
    const addBookForm = document.getElementById('add_book_form');

    addBookForm.addEventListener('submit', function(event) {
        let title = document.getElementById('title_input').value;
        let author = document.getElementById('author_input').value;
        let publisher = document.getElementById('publisher_input').value;
        let publicationYear = 	
			document.getElementById('publication_year_input').value;
        let genre = document.getElementById('genre_input').value;

        event.preventDefault();
        const bookData = {
            title: title,
            author: author,
            publisher: publisher,
            publication_year: publicationYear,
            genre: genre
        };

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(bookData)
        })
        .then(response => {
            console.log('Book added:', response);
            getBooks(); 
        })
        .catch(error => {
            console.error('Error adding book:', error);
        });

        document.getElementById('title_input').value = "";
        document.getElementById('author_input').value = "";
        document.getElementById('publisher_input').value = "";
        document.getElementById('publication_year_input').value = "";
        document.getElementById('genre_input').value = "";

    });
}

function editBook(id) {
    const title = document.getElementById(`title_${id}`);
    const author = document.getElementById(`author_${id}`);
    const publisher = document.getElementById(`publisher_${id}`);
    const publicationYear = 
		document.getElementById(`publication_year_${id}`);
    const genre = document.getElementById(`genre_${id}`);

    title.innerHTML = `
        <input 
        type="text" 
        id="edit_title_${id}" 
        value="${title.innerText}">`;
    author.innerHTML = `
        <input 
        type="text" 
        id="edit_author_${id}" 
        value="${author.innerText}">`;
    publisher.innerHTML = `
        <input 
        type="text" 
        id="edit_publisher_${id}" 
        value="${publisher.innerText}">`;
    publicationYear.innerHTML = `
        <input 
        type="text" 
        id="edit_publication_year_${id}" 
        value="${publicationYear.innerText}">`;
    genre.innerHTML = `
        <input 
        type="text" 
        id="edit_genre_${id}" 
        value="${genre.innerText}">`;

    const editButton = document.querySelector(`
        button[onclick="editBook(${id})"]
        `);
    editButton.innerText = 'Save';
    editButton.setAttribute('onclick', `saveBook(${id})`);
}

function saveBook(id) {
    const newTitle = document.getElementById(`edit_title_${id}`).value;
    const newAuthor = document.getElementById(`edit_author_${id}`).value;
    const newPublisher = 
		document.getElementById(`edit_publisher_${id}`).value;
    const newPublicationYear = 
		document.getElementById(`edit_publication_year_${id}`).value;
    const newGenre = document.getElementById(`edit_genre_${id}`).value;

    fetch(backendUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            id: id,
            title: newTitle,
            author: newAuthor,
            publisher: newPublisher,
            publication_year: newPublicationYear,
            genre: newGenre
        })
    })
    .then(response => response.text())
    .then(data => {
        getBooks();
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteBook(id) {
    fetch(backendUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        getBooks();
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function navigateToCountries() {
    window.location.href = "countries.html";
}

document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.getElementById('sort');
    const commentsContainer = document.getElementById('comments_container');
    const teammateCommentsHeader = commentsContainer.querySelector('h2');
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


getBooks();