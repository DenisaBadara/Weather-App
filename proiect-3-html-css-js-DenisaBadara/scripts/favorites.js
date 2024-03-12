let favoriteCities = [];

function addFavoriteCity() {
    const cityInput = document.getElementById('cities');
    const cityName = cityInput.value.trim();

    if (cityName && !favoriteCities.includes(cityName)) {
        favoriteCities.push(cityName);
        updateFavoritesList();
        updateShowFavoritesButton();
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favoriteCitiesList');

    if (favoritesList) {
        favoritesList.innerHTML = '';

        if (favoriteCities.length === 0) {
            favoritesList.innerHTML += '<p>No favorite cities added yet.</p>';
        } else {
            favoriteCities.forEach(city => {
                const li = document.createElement('li');
                li.textContent = city;
                li.setAttribute('data-city-name', city);
                li.addEventListener('click', handleFavoriteCityClick);
                favoritesList.appendChild(li);
            });
        }
    }
}

function updateShowFavoritesButton() {
    const favoritesButton = document.getElementById('favoritesButton');
    if (favoritesButton) {
        favoritesButton.style.display = (favoriteCities.length > 0) ? 'block' : 'none';
    }
}

function toggleFavoriteCities() {
    const favoritesList = document.getElementById('favoriteCitiesList');

    if (favoritesList) {
        const isListVisible = favoritesList.style.display === 'block';
        favoritesList.style.display = isListVisible ? 'none' : 'block';

        const favoritesButton = document.getElementById('favoritesButton');
        if (favoritesButton) {
            favoritesButton.textContent = isListVisible ? "Favorite Cities" : "Hide Favorites";
        }
    }
}


function handleFavoriteCityClick(event) {
    const cityName = event.target.getAttribute('data-city-name');
    if (cityName) {
        updateSearchBox(cityName);
        getWeatherDataForFavoriteCity(cityName);
        getCityImage(cityName, 0.4); 
    }
}


function updateSearchBox(cityName) {
    const searchBox = document.getElementById('cities');
    if (searchBox) {
        searchBox.value = cityName;
    }
}


function getWeatherDataForFavoriteCity(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}
