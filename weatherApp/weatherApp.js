document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '22ed9ad762b0e13ecfa17ea017a09a16'; 
    const searchInput = document.querySelector('.search input');
    const searchIcon = document.querySelector('.search svg');
    const beforeSearch = document.querySelector('.before-search');
    const notFound = document.querySelector('.not-found');
    const weather = document.querySelector('.weather');

    beforeSearch.classList.remove('hidden');
    notFound.classList.add('hidden');
    weather.classList.add('hidden');

    searchIcon.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
            fetchForecast(city);
        }
    });

    function fetchWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
                showWeatherDisplay();
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                showNotFoundDisplay();
            });
    }

    function fetchForecast(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then(data => {
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching forecast:', error));
    }

    function displayWeather(data) {
        const cityName = document.querySelector('.city-name');
        const weekDay = document.querySelector('.week-day');
        const day = document.querySelector('.day');
        const month = document.querySelector('.month');
        const weatherIcon = document.querySelector('.weather-icon');
        const celcius = document.querySelector('.celcius');
        const condition = document.querySelector('.condition');
        const humidityValue = document.querySelector('.humidity-value');
        const windSpeedValue = document.querySelector('.wind-speed-value');

        const date = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        cityName.textContent = data.name;
        weekDay.textContent = daysOfWeek[date.getDay()] + ', ';
        day.textContent = date.getDate();
        month.textContent = months[date.getMonth()];

        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" class="weather-icon-img">`;
        celcius.textContent = `${Math.round(data.main.temp)} °C`;
        condition.textContent = data.weather[0].description;
        humidityValue.textContent = `${data.main.humidity}%`;
        windSpeedValue.textContent = `${data.wind.speed} m/s`;
    }

    function displayForecast(data) {
        const forecastContainer = document.querySelector('.forecast');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');

            const date = new Date(data.list[i].dt * 1000);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const day = date.getDate();

            const dateElement = document.createElement('p');
            dateElement.classList.add('date');
            dateElement.textContent = `${dayOfWeek}, ${day}`;

            const iconElement = document.createElement('img');
            iconElement.classList.add('weather-icon');
            iconElement.src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
            iconElement.alt = data.list[i].weather[0].description;

            const tempElement = document.createElement('div');
            tempElement.classList.add('celcius');
            tempElement.textContent = `${Math.round(data.list[i].main.temp)} °C`;

            forecastDay.appendChild(dateElement);
            forecastDay.appendChild(iconElement);
            forecastDay.appendChild(tempElement);
            forecastContainer.appendChild(forecastDay);
        }
    }

    function showWeatherDisplay() {
        beforeSearch.classList.add('hidden');
        notFound.classList.add('hidden');
        weather.classList.remove('hidden');
    }

    function showNotFoundDisplay() {
        beforeSearch.classList.add('hidden');
        weather.classList.add('hidden');
        notFound.classList.remove('hidden');
    }
});


  