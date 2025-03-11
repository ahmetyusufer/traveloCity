import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import Button from "./Button";
import { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNavigate } from "react-router-dom";

import { useSearchParams } from "react-router-dom";

function Map() {
  const [mapPosition, setMapPosition] = useState([41, 23]);
  const { cities } = useCities();
  const navigate = useNavigate();

  const [search] = useSearchParams();
  const lat = search.get("lat");
  const lng = search.get("lng");

  const {
    isLoading: geoIsLoading,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);

  function ClickLocation() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        navigate(`form?lat=${lat}&lng=${lng}`);
      },
    });
  }

  function ChangeCenter() {
    const map = useMap();
    map.setView(mapPosition);
    return null;
  }

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        {!geoLocationPosition && (
          <Button type={"position"} onClick={getPosition}>
            {geoIsLoading ? "Loading..." : "Use Your Position"}
          </Button>
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.country}</span>
              <mark>{city.cityName}</mark>
            </Popup>
          </Marker>
        ))}
        <ClickLocation />
        <ChangeCenter />
      </MapContainer>
    </div>
  );
}

export default Map;
