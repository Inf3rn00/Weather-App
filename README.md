# Dynamic Weather App (Vanilla JS)

A responsive weather dashboard built with semantic HTML, modern CSS, and vanilla JavaScript. It fetches current conditions and a 5-day outlook from OpenWeatherMap and demonstrates DOM manipulation, async/await with Fetch API, event listeners, localStorage, and error handling.

## Features
- Search any city and view current temperature, condition, humidity, wind, and icon.
- 5-day forecast cards (midday snapshot for clarity).
- °C / °F toggle with instant re-fetch.
- Recent searches stored in `localStorage` for quick reuse.
- Live date/time header, loading spinner, and graceful error messages.
- Mobile-first, responsive layout with CSS Grid/Flex and CSS variables.

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
- **LocalStorage:** `saveToLocalStorage` + `loadRecentSearches` persist recent cities.
- **Error handling:** `showError` surfaces API issues or missing key; UI hides spinner on failure.
- **Responsive CSS:** variables for theming, Grid for forecasts, Flex for header/search, breakpoints for mobile/tablet/desktop.

## Deployment (GitHub Pages)
1. Ensure your API key is set in `script.js`.
2. Commit and push to GitHub.
3. In your repo, go to **Settings → Pages**.
4. Select branch `main` (or `master`) and root (`/`) as the source, then save.
5. Your live URL will be `https://<username>.github.io/weather-app/`.

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

