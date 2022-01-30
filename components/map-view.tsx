import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const iconLocator = new L.Icon({
  iconUrl: '/map-marker.png',
  iconRetinaUrl: '/map-marker.png',
  iconSize: new L.Point(20, 22),
  className: 'leaflet-div-icon',
});

interface placeable {
  text: string;
  lat: number;
  lng: number;
}

interface State {
  lat: number;
  lng: number;
}

/**
 * @param {any} props the props. should have a placeable array
 * @return {JSX.Element} the map view
 */
export default function MapView({
  placeables,
}: {
  placeables?: placeable[];
}): JSX.Element {
  const [values] = useState<State>({
    lat: 54.010381,
    lng: -2.785917,
  });

  const markers = (placeables ?? []).map((p, n) => {
    return (
      <Marker
        /* @ts-ignore next-line */
        icon={iconLocator}
        key={`map-marker-${n}`}
        position={[p.lat, p.lng]}
      >
        <Popup>{p.text}</Popup>
      </Marker>
    );
  });

  return (
    // Important! Always set the container height explicitly
    <MapContainer
      center={[values.lat, values.lng]}
      zoom={17.5}
      scrollWheelZoom
      style={{ height: '50vh', width: '100%' }}
    >
      <TileLayer
        /* @ts-ignore next-line */ // Attribution is improperly decalared for this module.
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
    </MapContainer>
  );
}
