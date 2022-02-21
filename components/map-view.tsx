import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { Zone } from 'types/map';
import { Device, Reading, Type as DeviceType } from 'types/device';

const iconLocator = new L.Icon({
  iconUrl: '/map-marker.png',
  iconRetinaUrl: '/map-marker.png',
  iconSize: new L.Point(20, 22),
});

/**
 * @param {Device[]} devices the dashboard data
 * @param {Reading[]} readings the dashboard data
 * @param {Type[]} deviceTypes the dashboard data
 * @return { any } the extracted placeable items
 */
function toPlaceables({
  devices,
  readings,
  deviceTypes,
}: {
  devices: Device[];
  readings: Reading[];
  deviceTypes: DeviceType[];
}): { text: string; lat: number; lng: number; fill?: string }[] {
  const hasLatLng = (r: Reading) =>
    typeof r.location !== 'undefined' &&
    typeof r.location.latitude !== 'undefined' &&
    typeof r.location.longitude !== 'undefined';

  const getLatest = (rs: Reading[]): Reading | null => {
    if (rs.length === 0) {
      return null;
    }

    let latest: Reading = rs[0];
    for (let i = 1; i < rs.length; i++) {
      if (
        new Date(latest.reported_at).valueOf() <
        new Date(rs[i].reported_at).valueOf()
      ) {
        latest = rs[i];
      }
    }
    return latest;
  };

  const allLocs = readings.filter(hasLatLng);
  return devices
    .map((d) => ({
      ...d,
      latestLocation: getLatest(allLocs.filter((r) => r.device_id === d.id)),
      deviceType: deviceTypes.filter((dt) => dt.id === d.type_id).at(0),
    }))
    .filter((d) => d.latestLocation !== null)
    .map((l) => ({
      text:
        `${l.name}: ${l.id}` +
        (typeof l.deviceType !== undefined ? ` (${l.deviceType?.name})` : ''),
      fill:
        typeof l.deviceType !== 'undefined'
          ? `rgb(${l.deviceType.colour.r}, ${l.deviceType.colour.g}, ${l.deviceType.colour.b})`
          : undefined,
      lat: l.latestLocation?.location?.latitude ?? 0,
      lng: l.latestLocation?.location?.longitude ?? 0,
    }));
}

interface State {
  lat: number;
  lng: number;
}

const geoToPolygon = (geo: any): [number, number][] => {
  const coords = geo?.features?.at(0)?.geometry?.coordinates?.at(0) ?? null;
  if (Array.isArray(coords)) {
    return coords;
  }
  return [];
};

/**
 * @param {any} props the props. should have a placeable array
 * @return {JSX.Element} the map view
 */
export default function MapView({
  placeables,
  zones,
}: {
  placeables?: {
    devices: Device[];
    readings: Reading[];
    deviceTypes: DeviceType[];
  };
  zones?: Zone[];
}): JSX.Element {
  const [values] = useState<State>({
    lat: 54.010381,
    lng: -2.785917,
  });

  // setup leaflet draw

  const markers = toPlaceables(
    placeables ?? { deviceTypes: [], devices: [], readings: [] }
  ).map((p, n) => {
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

  const polygons = (zones ?? []).map((z, n) => {
    return (
      <Polygon
        key={z.id}
        pathOptions={{
          color: `rgb(${z.colour.r}, ${z.colour.g}, ${z.colour.b})`,
          fill: true,
          fillColor: `rgb(${z.colour.r}, ${z.colour.g}, ${z.colour.b})`,
          fillOpacity: 0.25,
        }}
        positions={geoToPolygon(z.geo_json)}
      />
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
        maxNativeZoom={19}
        maxZoom={19}
      />
      {markers}
      {polygons}
    </MapContainer>
  );
}
