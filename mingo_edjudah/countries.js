function goToCountryWebpage() {
    window.location.href = "countries.html";
}

async function searchCountry() {
    const searchInput = document.getElementById('search_input').value;

    try {
        const countryResponse = await 
            fetch(`https://restcountries.com/v3.1/name/${searchInput}`);
        const countryData = await countryResponse.json();

        const country = countryData[0];
        const region = country?.region;

        if (region) {
            const regionResponse = await 
                fetch(`https://restcountries.com/v3.1/region/${region}`);
            const regionCountries = await regionResponse.json();

            displayCountryDetails(country);

            const otherCountries = regionCountries.filter
                (c => !c.name.common.includes(country.name.common));
            displayRegionCountries(otherCountries);
        } else {
            alert('Country not found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
    }
}

function displayCountryDetails(country) {
    const countryDetailsContainer = 
        document.getElementById('country_details');
    countryDetailsContainer.innerHTML =
        `<div class="country-card">
            <h2>${country.name.common}</h2>
            <p>Region: ${country.region}</p>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Area: ${country.area} km²</p>
            <p>Language: ${Object.values(country.languages).join(', ')}</p>
        </div>`;
}

function displayRegionCountries(regionCountries) {
    const regionCountriesContainer = 
        document.getElementById('region_countries');
    regionCountriesContainer.innerHTML =
        `<div class="country-card">
            <h2><strong>Other countries in the same region:</strong></h2>
            <ul>${regionCountries.map
                (country => `<li>${country.name.common}</li>`).join('')}</ul>
        </div>`;
}