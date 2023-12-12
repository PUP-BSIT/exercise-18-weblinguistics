async function searchCountry() {
    const searchInput = document.getElementById('search_input').value;

    try {
        const response = await fetch
			(`https://restcountries.com/v3.1/name/${searchInput}`);
        const countryData = await response.json();

        if (!countryData.length) {
            throw new Error("Country not found");
        }

        const country = countryData[0];
        const region = country.region;

        document.getElementById('country_details').innerHTML = '';
        document.getElementById('region_countries').innerHTML = '';

        const countryCard = createCountryCard(country);
        document.getElementById('country_details')
			.appendChild(countryCard);

        if (region) {
            await loadRegionCountries(region, country.name.common);
        } else {
            console.error('No region info for the specified country.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function loadRegionCountries(region, searchedCountryName) {
    try {
        const response = await fetch
			(`https://restcountries.com/v3.1/region/${region}`);
        const data = await response.json();

        document.getElementById('region_countries').innerHTML = '';

        displayRegionCountries(data, searchedCountryName);
    } catch (error) {
        console.error('Error fetching region data:', error);
    }
}

function createCountryCard(country) {
    const card = document.createElement('div');
    card.classList.add('country-card');
    card.innerHTML = `
        <h2>${country.name.common}</h2>
        <p>Region: ${country.region}</p>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Area: ${country.area ? 
			`${country.area} square kilometers` : ''}</p>
        <p>Languages: ${Object.values(country.languages)
			.join(', ')}</p>`;
    return card;
}

function displayRegionCountries(countries, searchedCountryName) {
    const regionCountriesContainer = document.getElementById
		('region_countries');
    regionCountriesContainer.innerHTML = 
		'<h3>Countries in the Same Region:</h3>';

    const countriesList = document.createElement('ul');

    countries.forEach(function (country) {
        if (country.name.common !== searchedCountryName) {
            const listItem = document.createElement('li');
            listItem.textContent = country.name.common;
            countriesList.appendChild(listItem);
        }
    });

    regionCountriesContainer.appendChild(countriesList);
}