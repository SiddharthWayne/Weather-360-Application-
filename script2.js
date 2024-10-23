const apiKey = 'e9866d2a1f48c0000ce86430ddb0a8e8'; // OpenWeatherMap API key

// Geolocation to fetch user location automatically
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      updateWeatherUI(data);
    }, function (error) {
      alert('Unable to retrieve your location. Please enter a city name.');
    });
  }
};

// Autocomplete location using OpenWeatherMap geocoding API
$(function() {
  $("#cityInput").autocomplete({
    source: async function(request, response) {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${request.term}&limit=5&appid=${apiKey}`;
      const data = await fetch(url).then(res => res.json());
      response(data.map(item => ({
        label: item.name + ', ' + item.country,
        value: item.name
      })));
    },
    minLength: 2,
    select: function(event, ui) {
      $('#cityInput').val(ui.item.value);
    }
  });
});

// Function to get weather data using city name
async function getWeatherByCity() {
  const city = document.getElementById('cityInput').value;
  if (city === '') {
    alert('Please enter a city name');
    return;
  }
  await getWeatherData(city);
}

// Function to fetch weather data
async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      updateWeatherUI(data);
    } else {
      alert('City not found!');
    }
  } catch (error) {
    alert('Error fetching weather data!');
  }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  document.getElementById('locationName').innerText = data.name;
  document.getElementById('temperature').innerText = data.main.temp;
  document.getElementById('weatherDescription').innerText = data.weather[0].description;
  document.getElementById('humidity').innerText = data.main.humidity;
  document.getElementById('windSpeed').innerText = data.wind.speed;

  // Update the weather icon
  const weatherIcon = data.weather[0].icon;
  document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;}