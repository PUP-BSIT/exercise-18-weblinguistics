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

            return order === 
				'asc' ? timestampA - timestampB : timestampB - timestampA;
        });

        container.innerHTML = "";

        commentsArray.forEach(commentNode => {
            container.appendChild(commentNode);
        });
    }
});

const backendUrl = "https://postify.tech/api_exercise18/nabayra_backend.php";

const houseOptions = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];

function getCharacters() {
    fetch(backendUrl, { method: 'GET' })
        .then(response => response.json())
        .then(data => displayCharacters(data))
        .catch(error => console.error('Error:', error));
}

function displayCharacters(characters) {
    const characterList = document.getElementById('character_list');
    characterList.innerHTML = '';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character-entry');
        characterDiv.innerHTML = `
            <p>Name: <p id="name_${character.id}">
				${character.name}</p><hr></p>
            <p>House: <p id="house_${character.id}">
				${character.house}</p><hr></p>
            <p>Birth Date: <p id="birth_date_${character.id}">
				${character.birth_date}</p><hr></p>
            <p>Patronus: <p id="patronus_${character.id}">
				${character.patronus}</p><hr></p>
            <p>Wand: <p id="wand_${character.id}">
				${character.wand}</p><hr></p>
            <button onclick="editCharacter(${character.id})">Edit</button>
            <button onclick="deleteCharacter(${character.id})">
				Delete</button>
        `;
        characterList.appendChild(characterDiv);
    });
}

function addCharacter() {
    const addCharacterForm = document.getElementById('add_character_form');
    const houseSelect = document.getElementById('house_input');

    houseOptions.forEach(house => {
        const option = document.createElement('option');
        option.value = house;
        option.text = house;
        houseSelect.add(option);
    });

    addCharacterForm.addEventListener('submit', function(event) {
        let name = document.getElementById('name_input').value;
        let house = houseSelect.value;
        let birthDate = document.getElementById('birth_date_input').value;
        let patronus = document.getElementById('patronus_input').value;
        let wand = document.getElementById('wand_input').value;

        event.preventDefault();
        const characterData = 
			{ name, house, birth_date: birthDate, patronus, wand };

        fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify(characterData)
        })
        .then(response => {
            console.log('Character added:', response);
            getCharacters();
        })
        .catch(error => console.error('Error adding character:', error));

        document.getElementById('name_input').value = "";
        houseSelect.value = "";
        document.getElementById('birth_date_input').value = "";
        document.getElementById('patronus_input').value = "";
        document.getElementById('wand_input').value = "";
    });
}

addCharacter();

function editCharacter(id) {
    const name = document.getElementById(`name_${id}`);
    const house = document.getElementById(`house_${id}`);
    const birthDate = document.getElementById(`birth_date_${id}`);
    const patronus = document.getElementById(`patronus_${id}`);
    const wand = document.getElementById(`wand_${id}`);

    name.innerHTML = `<input type="text" id="edit_name_${id}"
		value="${name.innerText}">`;

    const houseSelect = document.createElement('select');
    houseSelect.id = `edit_house_${id}`;
    houseOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        houseSelect.add(optionElement);
    });
    houseSelect.value = house.innerText;
    house.innerHTML = '';
    house.appendChild(houseSelect);

    birthDate.innerHTML = `<input type="date" id="edit_birth_date_${id}"
		value="${birthDate.innerText}">`;
    patronus.innerHTML = `<input type="text" id="edit_patronus_${id}" 
		value="${patronus.innerText}">`;
    wand.innerHTML = `<input type="text" id="edit_wand_${id}" 
		value="${wand.innerText}">`;

    const editButton = document.querySelector
		(`button[onclick="editCharacter(${id})"]`);
    editButton.innerText = 'Save';
    editButton.setAttribute('onclick', `saveCharacter(${id})`);
}

function saveCharacter(id) {
    const newName = document.getElementById(`edit_name_${id}`).value;
    const newHouse = document.getElementById(`edit_house_${id}`).value;
    const newBirthDate = 
		document.getElementById(`edit_birth_date_${id}`).value;
    const newPatronus = 
		document.getElementById(`edit_patronus_${id}`).value;
    const newWand = document.getElementById(`edit_wand_${id}`).value;

    fetch(backendUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: newName, house: newHouse, 
			birth_date: newBirthDate, patronus: newPatronus, 
			wand: newWand })
    })
    .then(response => response.text())
    .then(() => getCharacters())
    .catch(error => console.error('Error:', error));
}

function deleteCharacter(id) {
    fetch(backendUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}`
    })
    .then(() => getCharacters())
    .catch(error => console.error('Error:', error));
}

getCharacters();