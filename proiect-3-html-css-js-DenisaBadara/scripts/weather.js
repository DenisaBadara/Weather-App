const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const searchBox = document.getElementById('cities');
const searchBtn = document.getElementById('searchButton');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '71a603c806781b37428b78660f129df9';

function updateTimeAndDate() {
    const currentTime = new Date();
    const month = currentTime.getMonth();
    const currentDate = currentTime.getDate();
    const day = currentTime.getDay();
    const hour = currentTime.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = currentTime.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateEl.innerHTML = days[day] + ', ' + currentDate + ' ' + months[month];
}

setInterval(updateTimeAndDate, 1000);

searchBtn.addEventListener('click', () => {
    getWeatherData();
});

function getWeatherData() {
    const city = searchBox.value;
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

function showWeatherData(data) {
    let { city, list } = data;

    const placeContainer = document.querySelector('.place-container');
    placeContainer.querySelector('#time-zone').innerHTML = city.name;
    placeContainer.querySelector('#country').innerHTML = city.country;

    const weatherForecastContainer = document.querySelector('#weather-forecast');

    if (weatherForecastContainer) {
        weatherForecastContainer.style.display = 'flex';

        let otherDayForcast = '';

        const filteredList = list.filter((day, index) => index % 8 === 0 && index < 40);

        filteredList.forEach(day => {
            const { dt_txt, main, weather } = day;
            const date = new Date(dt_txt);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temperatureNight = Math.round(main.temp);
            const temperatureDay = Math.round(main.temp_max);

            const weatherIcon = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            otherDayForcast += `
                <div class="weather-forecast-item">
                    <div class="day">${dayOfWeek}</div>
                    <img src="${weatherIcon}" alt="weather icon" class="w-icon" />
                    <div class="temp">Night - ${temperatureNight}&#176; C</div>
                    <div class="temp">Day - ${temperatureDay}&#176; C</div>
                </div>`;
        });

        weatherForecastContainer.innerHTML = otherDayForcast;

        showCurrentWeatherData(data);
    } else {
        console.error('Container not found: #weather-forecast');
    }
}

function showCurrentWeatherData(data) {
    const currentWeatherItemsEl = document.getElementById('current-weather-items');

    if (data.list && data.list.length > 0) {
        const currentWeather = data.list[0];

        const { main, wind, sys } = currentWeather;
        const { humidity, pressure, temp } = main;
        const { speed: wind_speed } = wind;

        const pressureInAtmospheres = pressure / 1013.25;
        
        currentWeatherItemsEl.innerHTML =
            `<div class="weather-item">
                <div>Temperature</div>
                <div>${Math.round(temp)}°C</div>
            </div>
            <div class="weather-item">
                <div>Humidity</div>
                <div>${humidity}%</div>
            </div>
            <div class="weather-item">
                <div>Pressure</div>
                <div>${pressureInAtmospheres.toFixed(2)} atm</div>
            </div>
            <div class="weather-item">
                <div>Wind Speed</div>
                <div>${wind_speed}km/h</div>
            </div>`;
    } else {
        console.error('API response does not contain expected current weather data structure:', data);
    }
}
