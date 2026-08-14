// --- CONFIGURATION ---
const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Clé de démonstration valide
const DEFAULT_CITY = "Brazzaville";

// Elements DOM
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const historyContainer = document.getElementById('history-container');
const errorMessage = document.getElementById('error-message');

const cityNameEl = document.getElementById('city-name');
const currentTempEl = document.getElementById('current-temp');
const weatherIconEl = document.getElementById('weather-icon');
const weatherDescEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const updateTimeEl = document.getElementById('update-time');
const forecastListEl = document.getElementById('forecast-list');

// --- FONCTIONS UTILITAIRES (Niveau 2) ---

// Conversion Unix timestamp en heure HH:MM
function formatUnixTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Formatage des jours de la semaine pour les prévisions
function getDayName(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
}

// --- LOGIQUE API (Niveau 1, 2 & 3) ---

async function fetchWeatherData(city) {
  try {
    showError(""); // Masquer l'erreur précédente

    // 1. Météo actuelle
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=fr&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error("Ville non trouvée. Vérifie l'orthographe.");
    }

    const data = await response.json();

    // 2. Prévisions sur 5 jours
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=fr&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Mise à jour de l'interface
    updateCurrentWeather(data);
    updateForecast(forecastData.list);
    saveSearchHistory(data.name);

  } catch (error) {
    showError(error.message);
  }
}

// Mise à jour du DOM pour la météo actuelle
function updateCurrentWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  currentTempEl.textContent = Math.round(data.main.temp); // Arrondi de la température
  weatherDescEl.textContent = data.weather[0].description;
  humidityEl.textContent = `${data.main.humidity}%`;
  
  // Icone officielle d'OpenWeatherMap
  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Heure UNIX formatée
  updateTimeEl.textContent = formatUnixTime(data.dt, data.timezone);
}

// Mise à jour du DOM pour les prévisions (Filtrage des 5 jours à midi)
function updateForecast(forecastList) {
  forecastListEl.innerHTML = "";

  // Filtrer pour prendre un point de donnée par jour (autour de 12:00:00)
  const dailyForecasts = forecastList.filter(item => item.dt_txt.includes("12:00:00"));

  dailyForecasts.forEach(item => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-item');

    forecastCard.innerHTML = `
      <strong>${getDayName(item.dt)}</strong>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
      <div><strong>${Math.round(item.main.temp)}°C</strong></div>
    `;

    forecastListEl.appendChild(forecastCard);
  });
}

// --- HISTORIQUE & LOCALSTORAGE (Niveau 3) ---

function saveSearchHistory(cityName) {
  let history = JSON.parse(localStorage.getItem('datadash_history')) || [];

  // Éviter les doublons et garder les 5 plus récents
  history = history.filter(item => item.toLowerCase() !== cityName.toLowerCase());
  history.unshift(cityName);
  if (history.length > 5) history.pop();

  localStorage.setItem('datadash_history', JSON.stringify(history));
  renderHistoryTags();
}

function renderHistoryTags() {
  const history = JSON.parse(localStorage.getItem('datadash_history')) || [];
  historyContainer.innerHTML = "";

  history.forEach(city => {
    const tag = document.createElement('span');
    tag.classList.add('history-tag');
    tag.textContent = city;
    tag.addEventListener('click', () => fetchWeatherData(city));
    historyContainer.appendChild(tag);
  });
}

// --- GESTION DES ÉVÉNEMENTS & ERREURS ---

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    fetchWeatherData(query);
    cityInput.value = "";
  }
});

function showError(message) {
  if (message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  } else {
    errorMessage.classList.add('hidden');
  }
}

// --- INITIALISATION ---
window.addEventListener('DOMContentLoaded', () => {
  renderHistoryTags();
  fetchWeatherData(DEFAULT_CITY);
});