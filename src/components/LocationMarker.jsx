import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { formatTemperature } from '../utils/formatters.js'
import { getWeatherInfo } from '../utils/weatherCodes.js'

/** Marker + popup (name, temperature, condition). Popup opens once the forecast is ready. */
export default function LocationMarker({ location, current, unit }) {
  const markerRef = useRef(null)

  useEffect(() => {
    if (current) markerRef.current?.openPopup()
  }, [current])

  const info = current ? getWeatherInfo(current.weatherCode, current.isDay) : null

  return (
    <Marker ref={markerRef} position={[location.latitude, location.longitude]} title={location.name}>
      <Popup autoPan={false}>
        <div className="min-w-[8rem] text-slate-900">
          <p className="m-0 font-semibold">{location.name}</p>
          {current ? (
            <p className="m-0 mt-1 flex items-center gap-1.5">
              <info.Icon size={18} aria-hidden="true" />
              <span>
                {formatTemperature(current.temperature, unit)} · {info.label}
              </span>
            </p>
          ) : (
            <p className="m-0 mt-1 text-slate-600">Loading weather…</p>
          )}
        </div>
      </Popup>
    </Marker>
  )
}
