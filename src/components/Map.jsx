import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCities } from '../contexts/CitiesContext'
import styles from './Map.module.css'

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0])
  const { cities } = useCities()

  const [searchParams] = useSearchParams()
  const mapLat = searchParams.get('lat')
  const mapLng = searchParams.get('lng')

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng])
    }
  }, [mapLat, mapLng])

  const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
      .map((char) => String.fromCharCode(char - 127397).toLowerCase())
      .join('')
    return <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  }

  return (
    <div className={styles.mapContainer}>
      <MapContainer className={styles.map} center={mapPosition} zoom={4} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>{flagemojiToPNG(city.emoji)}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)

  return null // component need to return some jsx - null is valid
}

function DetectClick() {
  const navigate = useNavigate()

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })
}

export default Map
