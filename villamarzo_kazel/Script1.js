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
        const commentNodes = container.querySelectorAll
			('.comment-container');
        const commentsArray = Array.from(commentNodes);

        commentsArray.sort(function (a, b) {
            const timestampA = new Date(a.getAttribute('data-timestamp'));
            const timestampB = new Date(b.getAttribute('data-timestamp'));

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

document.addEventListener('DOMContentLoaded', function () {
	const backendUrl = 
		"https://postify.tech/api_exercise18/nabayra_backend.php";
    const backendUrl = "villamarzo_backend.php";

    function getSongs() {
        fetch(backendUrl, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            displaySongs(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function displaySongs(songs) {
        const songList = document.getElementById('song_list');
        songList.innerHTML = '';

        songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song-entry');
            songDiv.innerHTML = `
                <p>Title: 
                    <span id="title_${song.id}">
                        ${song.title}</span><hr>
                </p>
                <p>Artist: 
                    <span id="artist_${song.id}">${song.artist}</span><hr>
                </p>
                <p>Genre: 
                    <span id="genre_${song.id}">
                        ${song.genre}</span><hr>
                </p>
                <p>Writer: 
                    <span id="writer_${song.id}">${song.writer}</span><hr>
                </p>
                <p>Year: 
                    <span id="year_${song.id}">
                        ${song.year}</span><hr>
                </p>
                <button onclick="editSong(${song.id})">Edit</button>
                <button onclick="deleteSong(${song.id})">Delete</button>
            `;
            songList.appendChild(songDiv);
        });
    }

    function addSong() {
        const addSongForm = document.getElementById('add_song_form');

        addSongForm.addEventListener('submit', function(event) {
            let title = document.getElementById('title_input').value;
            let artist = document.getElementById('artist_input').value;
            let genre = document.getElementById('genre_input').value;
            let writer = document.getElementById('writer_input').value;
            let year = document.getElementById('year_input').value;

            event.preventDefault();
            const songData = {
                title: title,
                artist: artist,
                genre: genre,
                writer: writer,
                year: year
            };

            fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(songData)
            })
            .then(response => {
                console.log('Song added:', response);
                getSongs();
            })
            .catch(error => {
                console.error('Error adding song:', error);
            });

            document.getElementById('title_input').value = "";
            document.getElementById('artist_input').value = "";
            document.getElementById('genre_input').value = "";
            document.getElementById('writer_input').value = "";
            document.getElementById('year_input').value = "";
        });
    }

    function editSong(id) {
        const title = document.getElementById(title_${id});
        const artist = document.getElementById(artist_${id});
        const genre = document.getElementById(genre_${id});
        const writer = document.getElementById(writer_${id});
        const year = document.getElementById(year_${id});

        title.innerHTML = <input type="text" 
			id="edit_title_${id}" value="${title.innerText}">;
        artist.innerHTML = <input type="text" 
			id="edit_artist_${id}" value="${artist.innerText}">;
        genre.innerHTML = <input type="text" 
			id="edit_genre_${id}" value="${genre.innerText}">;
        writer.innerHTML = <input type="text" 
			id="edit_writer_${id}" value="${writer.innerText}">;
        year.innerHTML = <input type="text" 
			id="edit_year_${id}" value="${year.innerText}">;

        const editButton = document.querySelector
			(button[onclick="editSong(${id})"]);
        editButton.innerText = 'Save';
        editButton.setAttribute('onclick', saveSong(${id}));
    }

    function saveSong(id) {
        const newTitle = document.getElementById(edit_title_${id}).value;
        const newArtist = document.getElementById(edit_artist_${id}).value;
        const newGenre = document.getElementById(edit_genre_${id}).value;
        const newWriter = document.getElementById(edit_writer_${id}).value;
        const newYear = document.getElementById(edit_year_${id}).value;

        fetch(backendUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                title: newTitle,
                artist: newArtist,
                genre: newGenre,
                writer: newWriter,
                year: newYear
            })
        })
        .then(response => response.json())
        .then(data => {
            getSongs();
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function deleteSong(id) {
        fetch(backendUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            getSongs();
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    getSongs();
    addSong();
});