import { useEffect } from 'react'
import { CloudSun } from 'lucide-react'
import CurrentWeather from './components/CurrentWeather.jsx'
import DailyForecast from './components/DailyForecast.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import HourlyForecast from './components/HourlyForecast.jsx'
import LoadingSkeleton from './components/LoadingSkeleton.jsx'
import LocateButton from './components/LocateButton.jsx'
import Notice from './components/Notice.jsx'
import RecentSearches from './components/RecentSearches.jsx'
import SearchBar from './components/SearchBar.jsx'
import ThemeBackground from './components/ThemeBackground.jsx'
import UnitToggle from './components/UnitToggle.jsx'
import WeatherMap from './components/WeatherMap.jsx'
import { useGeolocation } from './hooks/useGeolocation.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useLocations } from './hooks/useLocations.js'
import { useWeather } from './hooks/useWeather.js'
import { UNITS, isValidUnit } from './utils/formatters.js'
import { STORAGE_KEYS } from './utils/locations.js'
import { getWeatherTheme } from './utils/weatherCodes.js'

const DEFAULT_THEME = 'clear-day'

export default function App() {
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.unit, UNITS.CELSIUS, isValidUnit)
  const { location, origin, recent, select, selectFromMap, clearRecent } = useLocations()
  const weather = useWeather(location)
  const geolocation = useGeolocation(select)

  const { data, lastData, status } = weather
  const themeSource = data ?? lastData
  const themeId = themeSource
    ? getWeatherTheme(themeSource.current.weatherCode, themeSource.current.isDay).id
    : DEFAULT_THEME

  useEffect(() => {
    document.title = `${location.name} · vmWeather`
  }, [location.name])

  return (
    <>
      <ThemeBackground themeId={themeId} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 text-white sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <CloudSun size={28} aria-hidden="true" />
            vmWeather
          </h1>
          <UnitToggle unit={unit} onChange={setUnit} />
        </header>

        {/* High z-index so the suggestion dropdown overlays the map below */}
        <div className="relative z-[1000] flex flex-col gap-3">
          <div className="flex gap-2">
            <SearchBar onSelect={select} />
            <LocateButton onClick={geolocation.locate} isLocating={geolocation.isLocating} />
          </div>
          <Notice message={geolocation.message} onDismiss={geolocation.dismissMessage} />
          <RecentSearches items={recent} onSelect={select} onClear={clearRecent} />
        </div>

        <main className="flex flex-col gap-4" aria-live="polite" aria-busy={status === 'loading'}>
          <div className="grid gap-4 lg:grid-cols-2">
            {status === 'error' && <ErrorMessage message={weather.error} onRetry={weather.retry} />}
            {status === 'loading' && <LoadingSkeleton variant="current" />}
            {data && <CurrentWeather location={location} current={data.current} today={data.daily[0]} unit={unit} />}
            {/* The map stays mounted (and clickable) in every state so a failed lookup is never a dead end */}
            <WeatherMap
              location={location}
              origin={origin}
              current={data?.current ?? null}
              unit={unit}
              onSelectPoint={selectFromMap}
            />
          </div>
          {status === 'loading' && <LoadingSkeleton variant="hourly" />}
          {data && <HourlyForecast hours={data.hourly} unit={unit} />}
          {status === 'loading' && <LoadingSkeleton variant="daily" />}
          {data && <DailyForecast days={data.daily} unit={unit} />}
        </main>

        <footer className="pb-2 text-center text-sm text-white/90">
          <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Weather data by Open-Meteo.com
          </a>
          {' · '}
          <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            Map data © OpenStreetMap contributors
          </a>
        </footer>
      </div>
    </>
  )
}
