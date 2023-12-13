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
 const backendUrl = "https://postify.tech/api_exercise18/fidel_backend.php";

function getBrands() {
    fetch(backendUrl, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        displayBrands(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function displayBrands(brands) {
    const brandList = document.getElementById('brand_list');
    brandList.innerHTML = '';

    brands.forEach(brand => {
        const brandDiv = document.createElement('div');
        brandDiv.classList.add('brand-entry');
        brandDiv.innerHTML = `
            <p>Brand Name: 
                <p id="brand_name_${brand.id}">
				${brand.brand_name}</p><hr>
            </p>
            <p>Industry: 
                <p id="industry_${brand.id}">${brand.industry}</p><hr>
            </p>
            <p>Founded Year: 
                <p id="founded_year_${brand.id}">
				${brand.founded_year}</p><hr>
            </p>
            <p>Founders: 
                <p id="founders_${brand.id}">${brand.founders}</p><hr>
            </p>
            <p>Headquarters: 
                <p id="headquarters_${brand.id}">
				${brand.headquarters}</p><hr>
            </p>
            <button onclick="editBrand(${brand.id})">Edit</button>
            <button onclick="deleteBrand(${brand.id})">Delete</button>
        `;
        brandList.appendChild(brandDiv);
    });
}

function addBrand() {
    const addBrandForm = document.getElementById('add_brand_form');

    addBrandForm.addEventListener('submit', function(event) {
        let brandName = document.getElementById
			('brand_name_input').value;
        let industry = document.getElementById
			('industry_input').value;
        let foundedYear = document.getElementById
			('founded_year_input').value;
        let founders = document.getElementById
			('founders_input').value;
        let headquarters = document.getElementById
			('headquarters_input').value;

        event.preventDefault();
        const brandData = {
            brand_name: brandName,
            industry: industry,
            founded_year: foundedYear,
            founders: founders,
            headquarters: headquarters
        };
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(brandData)
        })
        .then(response => {
            console.log('Brand added:', response);
            getBrands(); 
        })
        .catch(error => {
            console.error('Error adding brand:', error);
        });
        document.getElementById('brand_name_input').value = "";
        document.getElementById('industry_input').value = "";
        document.getElementById('founded_year_input').value = "";
        document.getElementById('founders_input').value = "";
        document.getElementById('headquarters_input').value = "";
    });
}
addBrand();
function editBrand(id) {
    const brandName = document.getElementById(`brand_name_${id}`);
    const industry = document.getElementById(`industry_${id}`);
    const foundedYear = document.getElementById(`founded_year_${id}`);
    const founders = document.getElementById(`founders_${id}`);
    const headquarters = document.getElementById(`headquarters_${id}`);

    brandName.innerHTML = `
        <input 
        type="text" 
        id="edit_brand_name_${id}" 
        value="${brandName.innerText}">`;
    industry.innerHTML = `
        <input 
        type="text" 
        id="edit_industry_${id}" 
        value="${industry.innerText}">`;
    foundedYear.innerHTML = `
        <input 
        type="text" 
        id="edit_founded_year_${id}" 
        value="${foundedYear.innerText}">`;
    founders.innerHTML = `
        <input 
        type="text" 
        id="edit_founders_${id}" 
        value="${founders.innerText}">`;
    headquarters.innerHTML = `
        <input 
        type="text" 
        id="edit_headquarters_${id}" 
        value="${headquarters.innerText}">`;

    const editButton = document.querySelector(`
        button[onclick="editBrand(${id})"]
        `);
    editButton.innerText = 'Save';
    editButton.setAttribute('onclick', `saveBrand(${id})`);
}

function saveBrand(id) {
    const newBrandName = document.getElementById
		(`edit_brand_name_${id}`).value;
    const newIndustry = document.getElementById
		(`edit_industry_${id}`).value;
    const newFoundedYear = document.getElementById
		(`edit_founded_year_${id}`).value;
    const newFounders = document.getElementById
		(`edit_founders_${id}`).value;
    const newHeadquarters = document.getElementById
		(`edit_headquarters_${id}`).value;

    fetch(backendUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
            id: id,
            brand_name: newBrandName,
            industry: newIndustry,
            founded_year: newFoundedYear,
            founders: newFounders,
            headquarters: newHeadquarters
        })
    })
    .then(response => response.text())
    .then(data => {
        getBrands();
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteBrand(id) {
    fetch(backendUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`
    })
    .then(response => response.text())
    .then(data => {
        getBrands();
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
getBrands();