import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../utils/leafletSetup.js'
import Card from './Card.jsx'
import LocationMarker from './LocationMarker.jsx'
import MapEvents from './MapEvents.jsx'
import { createCoordinateLocation, wrapLongitude } from '../utils/locations.js'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export default function WeatherMap({ location, origin, current, unit, onSelectPoint }) {
  const handleMapClick = ({ lat, lng }) => onSelectPoint(createCoordinateLocation(lat, wrapLongitude(lng)))

  return (
    <Card aria-labelledby="map-heading" padded={false} className="fade-in relative isolate z-0 flex flex-col overflow-hidden">
      <h2 id="map-heading" className="sr-only">
        Map
      </h2>
      <div className="relative min-h-[300px] flex-1 md:min-h-[400px]">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={9}
          minZoom={2}
          worldCopyJump
          className="absolute inset-0 rounded-3xl"
        >
          <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
          <MapEvents location={location} origin={origin} onMapClick={handleMapClick} />
          <LocationMarker location={location} current={current} unit={unit} />
        </MapContainer>
      </div>
      <p className="px-4 py-2.5 text-center text-sm text-white/90">Click anywhere on the map to see its weather.</p>
    </Card>
  )
}
