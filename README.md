# Dynamic Weather App (Vanilla JS)

A responsive weather dashboard built with semantic HTML, modern CSS, and vanilla JavaScript. It fetches current conditions  from OpenWeatherMap and demonstrates DOM manipulation, async/await with Fetch API, event listeners, localStorage, and error handling.


## Getting Started
1. **Clone or download** this repository.
2. **Install dependencies:** none required—pure HTML/CSS/JS.
3. **Add your OpenWeatherMap API key:**
   - Create a free account: https://home.openweathermap.org/users/sign_up
   - Copy your key from the dashboard.
   - Open `script.js` and replace `YOUR_API_KEY_HERE` with your key.
4. **Run locally:** open `index.html` in a browser (or use a simple local server like `npx serve` if you prefer).

## How It Works (Learning Highlights)
- **DOM manipulation:** elements updated in `displayCurrentWeather`, `displayForecast`, and recent-search rendering.
- **Async/await + Fetch:** API calls live in `fetchWeatherData`, wrapped in `try/catch`.
- **Event listeners:** search form submit, unit toggle click, and recent search buttons.
- **Error handling:** `showError` surfaces API issues or missing key; UI hides spinner on failure.
- **Responsive CSS:** variables for theming, Grid for forecasts, Flex for header/search, breakpoints for mobile/tablet/desktop.



## File Structure
```
weather-app/
├── index.html      # UI markup and sections
├── style.css       # Theming, layout, responsive rules
├── script.js       # Fetch logic, DOM updates, storage, events
├── assets/
│   ├── icons/      # (optional) custom icons
│   └── images/     # (optional) backgrounds
└── README.md
```

## Notes
- Free OpenWeatherMap tier has rate limits—avoid rapid repeated searches.
- No frameworks or build step required; works in modern browsers.

