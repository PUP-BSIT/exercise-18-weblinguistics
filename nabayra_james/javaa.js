function navigateToCountries() {
    window.location.href = "countries.html";
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

            newComment.innerHTML =
                `<strong>Name: ${name}</strong><br>${comment}<br><br>`;

            commentsContainer.appendChild(newComment);

            document.getElementById('name').value = "";
            commentText.value = "";

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
        const commentsArray = Array.from(commentNodes);

        commentsArray.sort((a, b) => {
            const timestampA = new Date(a.getAttribute('data-timestamp'));
            const timestampB = new Date(b.getAttribute('data-timestamp'));

            return order === 'asc' ?
                timestampA - timestampB : timestampB - timestampA;
        });

        container.innerHTML = "";

        commentsArray.forEach(commentNode => {
            container.appendChild(commentNode);
        });
    }
});

const backendUrl = "https://postify.tech/api_exercise18/nabayra_backend.php";

function getCharacters() {
    fetch(backendUrl, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        // Handle data - 'data' will contain the array of characters
        displayCharacters(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

// Function to display characters in the HTML with edit and delete options
function displayCharacters(characters) {
    const characterList = document.getElementById('character_list');
    characterList.innerHTML = '';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character-entry'); // Add a class for styling
        characterDiv.innerHTML = `
            <p>Name: 
                <p id="name_${character.id}">${character.name}</p><hr>
            </p>
            <p>House: 
                <p id="house_${character.id}">${character.house}</p><hr>
            </p>
            <p>Birth Date: 
                <p id="birth_date_${character.id}">${character.birth_date}</p><hr>
            </p>
            <p>Patronus: 
                <p id="patronus_${character.id}">${character.patronus}</p><hr>
            </p>
            <p>Wand: 
                <p id="wand_${character.id}">${character.wand}</p><hr>
            </p>
            <button onclick="editCharacter(${character.id})">Edit</button>
            <button onclick="deleteCharacter(${character.id})">Delete</button>
        `;
        characterList.appendChild(characterDiv);
    });
}

function addCharacter() {
    const addCharacterForm = document.getElementById('add_character_form');

    addCharacterForm.addEventListener('submit', function(event) {
        // Gather input values
        let name = document.getElementById('name_input').value;
        let house = document.getElementById('house_input').value;
        let birthDate = document.getElementById('birth_date_input').value;
        let patronus = document.getElementById('patronus_input').value;
        let wand = document.getElementById('wand_input').value;

        event.preventDefault(); // Prevents the default form submission
        // Create a data object with the gathered input
        const characterData = {
            name: name,
            house: house,
            birth_date: birthDate,
            patronus: patronus,
            wand: wand
        };

        // Send a POST request to add the character
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(characterData)
        })
        .then(response => {
            // Handle the response accordingly (refresh the displayed characters)
            console.log('Character added:', response);
            // Refresh the displayed characters
            getCharacters(); 
        })
        .catch(error => {
            // Handle errors
            console.error('Error adding character:', error);
        });

        // Clear input fields after submission
        document.getElementById('name_input').value = "";
        document.getElementById('house_input').value = "";
        document.getElementById('birth_date_input').value = "";
        document.getElementById('patronus_input').value = "";
        document.getElementById('wand_input').value = "";
    });
}

// Call the addCharacter function to enable form submission handling
addCharacter();

// Function to enable editing of a specific character
function editCharacter(id) {
    const name = document.getElementById(`name_${id}`);
    const house = document.getElementById(`house_${id}`);
    const birthDate = document.getElementById(`birth_date_${id}`);
    const patronus = document.getElementById(`patronus_${id}`);
    const wand = document.getElementById(`wand_${id}`);

    // Input fields to enable editing
    name.innerHTML = `
        <input 
        type="text" 
        id="edit_name_${id}" 
        value="${name.innerText}">`;
    house.innerHTML = `
        <input 
        type="text" 
        id="edit_house_${id}" 
        value="${house.innerText}">`;
    birthDate.innerHTML = `
        <input 
        type="text" 
        id="edit_birth_date_${id}" 
        value="${birthDate.innerText}">`;
    patronus.innerHTML = `
        <input 
        type="text" 
        id="edit_patronus_${id}" 
        value="${patronus.innerText}">`;
    wand.innerHTML = `
        <input 
        type="text" 
        id="edit_wand_${id}" 
        value="${wand.innerText}">`;

    // Change the button from "Edit" to "Save"
    const editButton = document.querySelector(`
        button[onclick="editCharacter(${id})"]
        `);
    editButton.innerText = 'Save';
    editButton.setAttribute('onclick', `saveCharacter(${id})`);
}

// Function to save the edited character details
function saveCharacter(id) {
    const newName = document.getElementById(`edit_name_${id}`).value;
    const newHouse = document.getElementById(`edit_house_${id}`).value;
    const newBirthDate = document.getElementById(`edit_birth_date_${id}`).value;
    const newPatronus = document.getElementById(`edit_patronus_${id}`).value;
    const newWand = document.getElementById(`edit_wand_${id}`).value;

    fetch(backendUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            id: id,
            name: newName,
            house: newHouse,
            birth_date: newBirthDate,
            patronus: newPatronus,
            wand: newWand
        })
    })
    .then(response => response.text())
    .then(data => {
        // Refresh the displayed characters after saving the changes
        getCharacters();
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

// Function to delete a specific character
function deleteCharacter(id) {
    fetch(backendUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        // Refresh the displayed characters after deletion
        getCharacters();
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
}

// Load characters data when the page loads
getCharacters();