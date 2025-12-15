// --- Configuration Constants ---

// Base URL for the OpenWeatherMap API endpoints
const API_BASE = "https://api.openweathermap.org/data/2.5";

const API_KEY = "1cae10ab0390bba91abadce52d373047";
// Default city to load weather data for on initial application startup
const DEFAULT_CITY = "Abuja";

// --- DOM Element References ---

// Cache references to all necessary HTML elements by their ID
const elements = {
  searchForm: document.getElementById("searchForm"), 
  cityInput: document.getElementById("cityInput"), 
  unitToggle: document.getElementById("unitToggle"), 
  recentSearches: document.getElementById("recentSearches"), 
  errorBox: document.getElementById("errorBox"), 
  spinner: document.getElementById("spinner"), 
  locationName: document.getElementById("locationName"), 
  conditionText: document.getElementById("conditionText"), 
  temperature: document.getElementById("temperature"), 
  humidity: document.getElementById("humidity"), 
  wind: document.getElementById("wind"), 
  weatherIcon: document.getElementById("weatherIcon"), 
  dateTime: document.getElementById("dateTime"), 
};

// --- Application State ---

// Stores the dynamic state of the application
const state = {
  unit: "metric",
  recent: [],
  lastCity: "",
};

// --- Utility Functions ---

/**
 * Toggles the visibility of the loading spinner.

 */
function showSpinner(isVisible) {
  elements.spinner.classList.toggle("hidden", !isVisible);
}

/**
 * Displays an error message in the dedicated error box.
 */

function showError(message) {
  elements.errorBox.textContent = message;
  elements.errorBox.classList.remove("hidden");
}

/**
 * Clears any currently displayed error message.
 */

function clearError() {
  elements.errorBox.textContent = "";
  elements.errorBox.classList.add("hidden");
}

/**
 * Formats a temperature value with the correct unit suffix based on the current state.
 */

function formatTemperature(value) {
  const suffix = state.unit === "metric" ? "°C" : "°F";
  return `${Math.round(value)}${suffix}`;
}

/**
 * Formats a wind speed value with the correct unit suffix based on the current state.
 */
function formatWind(value) {
  const suffix = state.unit === "metric" ? "km/h" : "mph";
  return `${Math.round(value)} ${suffix}`;
}

// --- Data Fetching ---

/**
 * @param {string} city - The name of the city to search for.
 * @returns {Promise<{weatherData: object}>} - Object containing weather data.
 * @throws {Error} - Throws an error if the API key is missing or fetching fails.
 */

async function fetchWeatherData(city) {
  // Determine which unit parameter to use for the API request
  const unitParam = state.unit === "metric" ? "metric" : "imperial";
  // Encode city name for use in the URL query string
  const queryCity = encodeURIComponent(city.trim());

  // Construct API URLs for current weather and 5-day forecast
  const weatherUrl = `${API_BASE}/weather?q=${queryCity}&units=${unitParam}&appid=${API_KEY}`;
  // const forecastUrl = `${API_BASE}/forecast?q=${queryCity}&units=${unitParam}&appid=${API_KEY}`;

  // Fetch both endpoints concurrently using Promise.all for faster loading
  const [weatherRes] = await Promise.all([fetch(weatherUrl)]);

  // Handle errors for current weather API call
  if (!weatherRes.ok) {
    if (weatherRes.status === 404) {
      throw new Error("City not found. Try another search.");
    }
    throw new Error("Unable to fetch weather right now.");
  }

  // Handle errors for forecast API call

  // Parse JSON response bodies
  const weatherData = await weatherRes.json();
  return { weatherData };
}

// --- Data Display ---

/**
 * Updates the DOM elements with the current weather data.
 */

function displayCurrentWeather(data) {
  // Destructure relevant data fields for cleaner access
  const {
    name,
    sys: { country },
    main: { temp, humidity },
    weather,
    wind,
  } = data;

  const condition = weather[0];
  // Construct the URL for the high-resolution weather icon
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;

  // Update DOM elements
  elements.locationName.textContent = `${name}, ${country}`;
  elements.conditionText.textContent = condition.description;
  elements.temperature.textContent = formatTemperature(temp);
  elements.humidity.textContent = `Humidity: ${humidity}%`;
  elements.wind.textContent = `Wind: ${formatWind(wind.speed)}`;
  elements.weatherIcon.src = iconUrl;
  elements.weatherIcon.alt = condition.description;
}

/**
 * Saves a city name to the in-memory list of recent searches (up to 4 cities).
 */

function saveToLocalStorage(city) {
  const trimmed = city.trim();
  if (!trimmed) return;
  // Create a new array: current city first, then unique recent cities (excluding the current one)
  const updated = [
    trimmed,
    ...state.recent.filter((c) => c.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, 4); // Limit to the 4 most recent
  state.recent = updated;
  loadRecentSearches(); // Re-render the recent search buttons
}

/**
 * Removes a city from the in-memory recent list and re-renders.
 */
function removeRecentCity(city) {
  state.recent = state.recent.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  loadRecentSearches();
}

/**
 * Renders clickable buttons for each recent search.
 */
function loadRecentSearches() {
  elements.recentSearches.innerHTML = ""; // Clear existing buttons

  // Create a button for each recent city
  state.recent.forEach((city) => {
    const pill = document.createElement("div");
    pill.className = "recent-pill";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "recent-chip";
    btn.textContent = city;
    btn.addEventListener("click", () => handleSearch(city));

    const del = document.createElement("button");
    del.type = "button";
    del.className = "recent-delete";
    del.textContent = "×";
    del.setAttribute("aria-label", `Remove ${city} from recent searches`);
    del.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the search
      removeRecentCity(city);
    });

    pill.appendChild(btn);
    pill.appendChild(del);
    elements.recentSearches.appendChild(pill);
  });
}

// --- UI Management ---

/**
 * Updates the date and time display element.
 */
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "short", // e.g., "Mon"
    hour: "2-digit", // e.g., "02"
    minute: "2-digit", // e.g., "15"
  };
  elements.dateTime.textContent = now.toLocaleString(undefined, options);
}

/**
 * Sets the text content and accessibility attribute for the unit toggle button.
 */
function setUnitButtonText() {
  const wantsF = state.unit === "metric"; // If current unit is metric, button should offer Fahrenheit
  elements.unitToggle.textContent = wantsF ? "Show °F" : "Show °C";
  // Set aria-pressed for accessibility (true if the *other* unit is selected)
  elements.unitToggle.setAttribute("aria-pressed", (!wantsF).toString());
}

// --- Event Handlers ---

/**
 * Main function to handle searching for weather data.
 * Can be triggered by form submission or clicking a recent search button.
 * @param {string} [cityFromButton] - Optional city name passed from a recent search button.
 */
async function handleSearch(cityFromButton) {
  // Get city name from button parameter or the input field
  const rawCity = cityFromButton ?? elements.cityInput.value;
  const city = rawCity.trim();
  if (!city) return;

  clearError();
  showSpinner(true);

  try {
    const { weatherData } = await fetchWeatherData(city);
    displayCurrentWeather(weatherData);
    saveToLocalStorage(weatherData.name);
    state.lastCity = weatherData.name; // Update last successful city
  } catch (error) {
    showError(error.message);
  } finally {
    showSpinner(false);
  }
}

/**
 * Toggles the temperature unit state and re-fetches data for the last searched city.
 */
function toggleTemperatureUnit() {
  // Toggle between 'metric' and 'imperial'
  state.unit = state.unit === "metric" ? "imperial" : "metric";
  setUnitButtonText();
  // Re-run the search with the new unit if a city has already been loaded
  if (state.lastCity) {
    handleSearch(state.lastCity);
  }
}

/**
 * Attaches event listeners to DOM elements.
 */
function bindEvents() {
  // Handle form submission to trigger a search
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form reload
    handleSearch();
  });

  // Handle unit toggle button click
  elements.unitToggle.addEventListener("click", toggleTemperatureUnit);
}

// --- Initialization ---

/**
 * Initializes the application: loads state, binds events, sets up timers, and loads default weather.
 */
function init() {
  loadRecentSearches();
  bindEvents();
  setUnitButtonText();
  updateDateTime();
  // Update the time display every second
  setInterval(updateDateTime, 1000);
  // Load weather for the default city on startup
  handleSearch(DEFAULT_CITY);
}

// Ensure the 'init' function runs once the entire HTML document is fully loaded
document.addEventListener("DOMContentLoaded", init);
