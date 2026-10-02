import { useEffect } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'

const CITY_ZOOM = 9

/**
 * Bridges the Leaflet map and React state:
 *  - clicks are reported upwards
 *  - location changes fly the map there (map clicks only re-centre, since the user already pointed there)
 */
export default function MapEvents({ location, origin, onMapClick }) {
  const map = useMap()
  const { latitude, longitude } = location

  useMapEvents({ click: (event) => onMapClick(event.latlng) })

  useEffect(() => {
    const target = [latitude, longitude]
    if (origin === 'initial') {
      map.setView(target, CITY_ZOOM, { animate: false })
    } else if (origin === 'map') {
      map.panTo(target, { animate: true })
    } else {
      map.flyTo(target, CITY_ZOOM, { duration: 1.5 })
    }
    // Deliberately depends on coordinates only: `origin` is read when the location changes.
  }, [map, latitude, longitude])

  return null
}
