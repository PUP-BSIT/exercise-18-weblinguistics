let nameInput = document.getElementById("name");
let commentInput = document.getElementById("comment");
let commentButton = document.getElementById("comment_button");
let commentsContainer = document.getElementById("comments_container");

function checkInputs() {
  if (nameInput.value && commentInput.value) {
    commentButton.disabled = false;
  } else {
    commentButton.disabled = true;
  }
}

function addComment() {
  if (nameInput.value && commentInput.value) {
    let commentElement = document.createElement("div");
    commentElement.className = "comment";
    
    commentElement.setAttribute("data-date", new Date().toLocaleString());

    commentElement.innerHTML = `<strong>${nameInput.value}:
	</strong> ${commentInput.value}`;

    commentsContainer.appendChild(commentElement);

    nameInput.value;
    commentInput.value;

    commentButton.disabled = true;
  }
}

function sortComments(order) {
  const comments = Array.from(commentsContainer.children);

  comments.sort((a, b) => {
    const dateA = new Date(a.getAttribute("data-date"));
    const dateB = new Date(b.getAttribute("data-date"));

    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  commentsContainer.innerHTML;
  comments.forEach(comment => {
    commentsContainer.appendChild(comment);
  });
}

function navigateToCountries() {
    window.location.href = "countries.html";
}

nameInput.addEventListener("input", checkInputs);
commentInput.addEventListener("input", checkInputs);
commentButton.addEventListener("click", addComment);