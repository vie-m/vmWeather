# vmWeather

A responsive weather app: search any city or click the map to see current conditions, a 24-hour forecast and a 7-day outlook. Frontend only, no backend and no API keys.



## Features

- **City search**: debounced (400 ms) autocomplete with up to 5 suggestions shown as "City, Region, Country". Arrow keys, Enter and Escape are supported, and the dropdown renders above the map.
- **Current weather**: city and country, local date/time, large temperature, icon and condition, feels like, humidity, wind, sunrise and sunset.
- **Hourly forecast**: next 24 hours in a horizontally scrollable row (hour, icon, temperature, rain chance).
- **7-day forecast**: "Today" plus six days with icon, min/max, rain chance and a min-max range bar.
- **Interactive map**: OpenStreetMap tiles, a marker with a popup (name, temperature, condition), smooth `flyTo` on new locations. Click anywhere to load that spot's weather (labelled "Selected location (lat, lon)").
- **°C / °F toggle**: converted client-side, so toggling never triggers a new request. Wind switches between km/h and mph. The choice is remembered.
- **Use my location**: browser Geolocation API with a friendly message if permission is denied. Search keeps working.
- **Persistence**: last location, unit and the last 5 searches (clearable) live in `localStorage`. Every access is wrapped in `try/catch`, so the app still works if storage is blocked. First visit defaults to Jakarta, Indonesia.
- **States**: skeleton placeholders while loading, an error card with "Try again", and a helpful empty state for searches with no results.
- **Design**: card layout, background gradient that follows the weather and day/night, responsive from 360 px up, no horizontal scroll, semantic HTML, ARIA labels, visible focus rings, reduced-motion support.

## Tech stack

- React 18 + Vite (JavaScript)
- Tailwind CSS 3
- Native `fetch` with `AbortController`
- [lucide-react](https://lucide.dev) icons
- Leaflet + react-leaflet v4 (v4 supports React 18; v5 needs React 19)
- [Open-Meteo](https://open-meteo.com) geocoding and forecast APIs (free, no key)
- OpenStreetMap tiles

## Project structure

```
src/
  components/   UI pieces (SearchBar, CurrentWeather, HourlyForecast, DailyForecast, WeatherMap, ...)
  hooks/        useWeather, useCitySearch, useDebounce, useLocalStorage, useLocations, useGeolocation
  services/     weatherApi.js: every network call lives here
  utils/        weatherCodes.js, formatters.js, locations.js, storage.js, leafletSetup.js
  App.jsx
  main.jsx
  index.css
```

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the service and utilities (node:test, no extra deps)
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

## Deploy

The build is a static site (`dist/`) using relative asset paths, so it works on any static host.

### Netlify

1. Push the project to GitHub.
2. In Netlify choose **Add new site, Import an existing project** and select the repo.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy. (Or drag the `dist/` folder onto <https://app.netlify.com/drop>.)

### Vercel

1. Push the project to GitHub.
2. In Vercel choose **Add New, Project** and import the repo. The Vite preset is detected automatically.
3. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

### GitHub Pages

Build with `npm run build`, then publish the `dist/` folder (for example with the `gh-pages` package or a GitHub Actions workflow).

## Credits

- Weather data by [Open-Meteo.com](https://open-meteo.com/)
- Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)

## What I learned

- _Add your own notes here, e.g. how you handled debounced search and request cancellation._
- _What you learned about integrating Leaflet with React and Vite (marker icons, CSS import)._
- _How you kept the UI accessible (combobox pattern, focus states, aria labels)._
- _Anything you would improve next._
