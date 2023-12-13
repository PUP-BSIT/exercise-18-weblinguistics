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
        const commentsArray = Array.from(commentNodes);

        commentsArray.sort((a, b) => {
            const timestampA = new Date(a.getAttribute('data-timestamp'));
            const timestampB = new Date(b.getAttribute('data-timestamp'));

            return order === 'asc' ? 
			timestampA - timestampB : timestampB - timestampA;
        });

        container.innerHTML;

        commentsArray.forEach(commentNode => {
            container.appendChild(commentNode);
        });
    }
});

// REST API Scripts
const backendUrl = "https://postify.tech/api_exercise18/nabayra_backend.php";

// Script for REST API section dropdown
const houses = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];

function populateHouseDropdown(elementId) {
  const houseSelect = document.getElementById(elementId);

  houses.forEach((house) => {
    const option = document.createElement("option");
    option.value = house.toLowerCase();
    option.textContent = house;
    houseSelect.appendChild(option);
  });

  houseSelect.addEventListener("change", function () {
    houseSelect.style.color = "white";
  });
}

// Call the function for each dropdown you want to populate
populateHouseDropdown("house");
populateHouseDropdown("edit-house");

// Fetch and display the character collection
function displayCharacters() {
  // Fetch character data using fetch()
  fetch(backendUrl, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // Clear existing character container
      let characterContainer = document.querySelector(".character-container");
      characterContainer.innerHTML = "<h3>Your Harry Potter Characters</h3>";

      // Create a table
      let table = document.createElement("table");
      table.classList.add("character-table");

      // Create table header
      let tableHeader = document.createElement("tr");
      tableHeader.innerHTML = `
          <th>Name</th>
          <th>House</th>
          <th>Birth Date</th>
          <th>Patronus</th>
          <th>Wand</th>
          <th>Action</th>
      `;
      table.appendChild(tableHeader);

      // Generate table rows for each character in the collection
      data.forEach((character) => {
        let tableRow = document.createElement("tr");
        tableRow.setAttribute("data-character-id", character.id); // Add this line

        // Display character details in table cells
        tableRow.innerHTML = `
            <td>${character.name}</td>
            <td>${character.house}</td>
            <td>${character.birth_date}</td>
            <td>${character.patronus}</td>
            <td>${character.wand}</td>
            <td>
                <button class="edit-btn" 
                onclick="editCharacter(${character.id})">Edit</button>
                <button class="delete-btn" 
                onclick="deleteCharacter(${character.id})">Delete</button>
            </td>
        `;

        // Append the table row to the table
        table.appendChild(tableRow);
      });

      // Append the table to the character container
      characterContainer.appendChild(table);
    })
    .catch((error) => console.error("Error fetching character collection:", error));
}

// Initially load the character collection
displayCharacters();

// Function to add a new character to the collection
function addCharacter() {
  let name = document.getElementById("name").value;
  let house = document.getElementById("house").value;
  let birthDate = document.getElementById("birth_date").value;
  let patronus = document.getElementById("patronus").value;
  let wand = document.getElementById("wand").value;

  if (!name || !house || !birthDate || !patronus || !wand) {
    alert("Please fill out all the fields.");
    return; // Stop the function if validation fails
  }

  // Send fetch request to the server-side script for adding a character
  fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "name=" +
      encodeURIComponent(name) +
      "&house=" +
      encodeURIComponent(house) +
      "&birth_date=" +
      encodeURIComponent(birthDate) +
      "&patronus=" +
      encodeURIComponent(patronus) +
      "&wand=" +
      encodeURIComponent(wand),
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the success response from the server
      alert(data);

      // Clear the form fields
      document.getElementById("name").value = "";
      document.getElementById("house").value = "";
      document.getElementById("birth_date").value = "";
      document.getElementById("patronus").value = "";
      document.getElementById("wand").value = "";

      // Refresh the character collection
      displayCharacters();
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Variable to store the currently editing character ID
let editingCharacterId;

// Function to open the edit modal
function editCharacter(characterId) {
  // Store the current character ID
  editingCharacterId = characterId;

  // Fetch character details by ID using fetch()
  fetch(`${backendUrl}?id=${characterId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // Populate the edit modal with character details
      document.getElementById("edit-name").value = data[0].name;
      document.getElementById("edit-house").value = data[0].house;
      document.getElementById("edit-birth_date").value = data[0].birth_date;
      document.getElementById("edit-patronus").value = data[0].patronus;
      document.getElementById("edit-wand").value = data[0].wand;

      // Show the edit modal
      document.getElementById("edit_modal").style.display = "block";
    })
    .catch((error) => console.error("Error fetching character details:", error));
}

// Function to close the edit modal
function closeEditModal() {
  document.getElementById("edit_modal").style.display = "none";
}

// Update the character
function updateCharacter() {
  // Get the updated character details from the edit form
  let characterId = editingCharacterId; // Use the stored editingCharacterId
  let name = document.getElementById("edit-name").value;
  let house = document.getElementById("edit-house").value;
  let birthDate = document.getElementById("edit-birth_date").value;
  let patronus = document.getElementById("edit-patronus").value;
  let wand = document.getElementById("edit-wand").value;

  // Send fetch request to the server-side script for updating a character
  fetch(backendUrl, {
    method: "PATCH", // Use 'PATCH' method for update
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "id=" +
      encodeURIComponent(characterId) +
      "&name=" +
      encodeURIComponent(name) +
      "&house=" +
      encodeURIComponent(house) +
      "&birth_date=" +
      encodeURIComponent(birthDate) +
      "&patronus=" +
      encodeURIComponent(patronus) +
      "&wand=" +
      encodeURIComponent(wand),
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the success response from the server
      alert(data);

      // Close the edit modal
      closeEditModal();

      // Refresh the character collection
      displayCharacters();
    })
    .catch((error) => {
      // Handle errors
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Delete the character
function deleteCharacter(characterId) {
  // Confirm with the user before deleting
  let confirmDelete = confirm("Are you sure you want to delete this character?");

  if (confirmDelete) {
    // Send fetch request to delete the character
    fetch(backendUrl + "?id=" + characterId, {
      method: "DELETE", // Use DELETE for deletion
    })
      .then((response) => response.text())
      .then((data) => {
        // Handle the success response from the server
        alert(data);

        // Refresh the character collection after successful deletion
        displayCharacters();
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}