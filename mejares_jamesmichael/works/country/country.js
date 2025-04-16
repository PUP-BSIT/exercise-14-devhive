document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('countrySearch');
    const searchBtn = document.getElementById('searchBtn');
    const countryDetails = document.getElementById('countryDetails');
    const regionCountries = document.getElementById('regionCountries');
    const loading = document.querySelector('.loading');
    const errorMessage = document.getElementById('errorMessage');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCountry();
        }
    });
    
    searchBtn.addEventListener('click', searchCountry);
    
    function searchCountry() {
        const country = searchInput.value.trim();
        
        if (!country) {
            showError('Please enter a valid country name');
            return;
        }
        
        countryDetails.style.display = 'none';
        regionCountries.style.display = 'none';
        errorMessage.style.display = 'none';
        loading.style.display = 'block';
        
        fetch(`https://restcountries.com/v3.1/name/${country}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Country not found, please try again.');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error('No result, country do not exists!.');
                }
            
                displayCountryDetails(data[0]);
                const region = data[0].region;
                return fetch(`https://restcountries.com/v3.1/region/${region}`);
            })
            .then(response => response.json())
            .then(regionData => {
                displayRegionCountries(regionData);
                loading.style.display = 'none';
            })
            .catch(error => {
                loading.style.display = 'none';
                showError(error.message);
            });
    }
    
    function displayCountryDetails(country) {
        document.getElementById('countryFlag').src = country.flags.svg;
        document.getElementById('countryName').textContent = 
            country.name.common;
        
        document.getElementById('capital').textContent = 
            country.capital ? country.capital.join(', ') : 'N/A';
        document.getElementById('region').textContent = 
            `${country.region} (${country.subregion || 'N/A'})`;
        document.getElementById('population').textContent = 
            formatNumber(country.population);
        document.getElementById('area').textContent = country.area ? 
            `${formatNumber(country.area)} km²` : 'N/A';
        
        let languagesText = 'N/A';
        if (country.languages) {
            languagesText = Object.values(country.languages).join(', ');
        }
        document.getElementById('languages').textContent = languagesText;

        let currenciesText = 'N/A';
        if (country.currencies) {
            const currencyList = [];
            for (const code in country.currencies) {
                currencyList.push(`${country.currencies[code].name} 
                    (${country.currencies[code].symbol || code})`);
            }
            currenciesText = currencyList.join(', ');
        }
        document.getElementById('currencies').textContent = currenciesText;
        
        document.getElementById('timezones').textContent = country.timezones ? 
            country.timezones.join(', ') : 'N/A';
        
        countryDetails.style.display = 'block';
    }
    
    function displayRegionCountries(countries) {
        if (countries.length > 0) { 
            document.getElementById('regionName').textContent = 
            countries[0].region;
        }
        
        const grid = document.getElementById('countriesGrid');
        grid.innerHTML = '';
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        countries.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.innerHTML = `
                <img src="${country.flags.svg}" 
                alt="${country.name.common} flag">
                <h3>${country.name.common}</h3>
            `;
            
            card.addEventListener('click', function() {
                searchInput.value = country.name.common;
                searchCountry();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            grid.appendChild(card);
        });
        
        regionCountries.style.display = 'block';
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});