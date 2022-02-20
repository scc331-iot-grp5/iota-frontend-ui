import { useRouter } from 'next/router';
import { getUserDetails } from 'types/user-details-local';
import Link from 'next/link';
import AppBar from '@/components/app-bar';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@material-ui/core';
import MapView from '@/components/map-view';
import { dataAPI } from 'redux/data-api';
import { Device, Reading, Type as DeviceType } from 'types/device';
import { Event } from 'types/rule';

/**
 * @param {Device[]} devices the device list
 * @param {Type[]} deviceTypes the device type list
 * @return {DataGrid} the grid!
 */
function dashToDeviceGrid(
  devices: Device[],
  deviceTypes: DeviceType[]
): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'sensor_set', headerName: 'Sensors', flex: 2 },
  ];

  return (
    <DataGrid
      rows={devices.map((d, n) => {
        // console.log(d.sensor_set);
        return {
          ...d,
          id: n,
          sensor_set: d.sensor_set.join(', ') || 'None reported',
          type: deviceTypes.filter((dt) => dt.id === d.type_id).at(0)?.name,
        };
      })}
      columns={columns}
      pageSize={10}
      autoHeight
    />
  );
}

/**
 * @param {Event[]} events the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToEventGrid(events: Event[]): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'created_at', headerName: 'Timestamp' },
    { field: 'severity', headerName: 'Severity' },
    { field: 'involves', headerName: 'Involved IDs' },
    { field: 'id', headerName: 'Event ID' },
    { field: 'rule', headerName: 'Rule ID' },
  ];

  return (
    <DataGrid
      rows={events.map((d, n) => ({
        ...d,
        id: n,
        timestamp: new Date(`${d.created_at}`),
        involves: d.involves.map((i) => i.device_id).join(', '),
      }))}
      autoHeight
      columns={columns}
      pageSize={10}
    />
  );
}
/**
 * @param {Reading[]} readings the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToReadingGrid(readings: Reading[]): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'reported_at', headerName: 'Reported At', flex: 1 },
    { field: 'heartbeat', headerName: 'Heartbeat' },
    { field: 'id', headerName: 'Reading ID' },
    { field: 'device_id', headerName: 'Device ID' },
    { field: 'acceleration', headerName: 'Acceleration' },
    { field: 'distances', headerName: 'Distances', flex: 1 },
    { field: 'heading', headerName: 'Heading' },
    { field: 'speed', headerName: 'Speed' },
    { field: 'temperature', headerName: 'Temp' },
    { field: 'volume', headerName: 'Vol' },
  ];

  return (
    <DataGrid
      rows={readings.map((d, n) => ({
        ...d,
        id: n,
        acceleration: d.acceleration?.x,
        distances: d.distances
          ?.map((ds) => `${ds.distance_from}:${ds.distance.toFixed(3)}m`)
          .join(', '),
      }))}
      autoHeight
      columns={columns}
      pageSize={10}
    />
  );
}

/**
 * @param {Device[]} devices the dashboard data
 * @param {Reading[]} readings the dashboard data
 * @param {Type[]} deviceTypes the dashboard data
 * @return { any } the extracted placeable items
 */
function placeables(
  devices: Device[],
  readings: Reading[],
  deviceTypes: DeviceType[]
): { text: string; lat: number; lng: number }[] {
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

/**
 * @return {JSX.Element} the login page
 */
export default function Dash(): JSX.Element {
  const router = useRouter();

  // check logged in
  const userDetails = getUserDetails();
  if (userDetails === null) {
    router.push('/');
    return (
      <div>
        <p>
          You&apos;re not logged in, redirecting... If you are not redirected in
          5 seconds please click <Link href="/">here</Link>
        </p>
      </div>
    );
  }

  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: events } = dataAPI.endpoints.listEvents.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: readings } = dataAPI.endpoints.listReadings.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: deviceTypes } = dataAPI.endpoints.listDeviceTypes.useQuery(
    null,
    { pollingInterval: 5000 }
  );

  return (
    <div>
      <Head>
        <title>IOTA: Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Map</Typography>
            <MapView
              placeables={placeables(
                devices ?? [],
                readings ?? [],
                deviceTypes ?? []
              )}
            />
          </Grid>

          <Grid item sm={6} xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Devices</Typography>
            {dashToDeviceGrid(devices ?? [], deviceTypes ?? [])}
          </Grid>
          <Grid item sm={6} xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Crashes</Typography>
            {dashToEventGrid(events ?? [])}
          </Grid>

          <Grid item xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Readings</Typography>
            {dashToReadingGrid(readings ?? [])}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
