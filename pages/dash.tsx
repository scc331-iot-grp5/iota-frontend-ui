import * as React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MapView from '../components/map-view';
import AppBar from '../components/app-bar';
import { Device, Reading, Type as DeviceType } from 'types/device';
import { Event, Rule } from 'types/rule';
import { getUserDetails } from 'types/user-details-local';

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
          id: d.id,
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
 * @param {Rule[]} rules the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToEventGrid(events: Event[], rules: Rule[]): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'created_at', headerName: 'Timestamp', flex: 1 },
    { field: 'severity', headerName: 'Severity' },
    { field: 'involves', headerName: 'Involved IDs', flex: 1 },
    { field: 'id', headerName: 'Event ID' },
    { field: 'rule', headerName: 'Rule', flex: 1 },
  ];

  return (
    <DataGrid
      rows={events.map((d, n) => ({
        ...d,
        id: n,
        timestamp: new Date(`${d.created_at}`),
        involves: d.involves.map((i) => i.device_id).join(', '),
        rule: rules.filter((r) => r.id === d.rule).at(0)?.name,
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
          ?.map((ds) => `${ds.distance_from}:${ds.distance.toFixed(2)}m`)
          .join(', '),
      }))}
      autoHeight
      columns={columns}
      pageSize={10}
    />
  );
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

  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: deviceTypes } = dataAPI.endpoints.listDeviceTypes.useQuery(
    null,
    { pollingInterval: 5000 }
  );
  const { data: events } = dataAPI.endpoints.listEvents.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: readings } = dataAPI.endpoints.listReadings.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: rules } = dataAPI.endpoints.listRules.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: zones } = dataAPI.endpoints.listZones.useQuery(null, {
    pollingInterval: 5000,
  });

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
              placeables={{
                devices: devices ?? [],
                readings: readings ?? [],
                deviceTypes: deviceTypes ?? [],
              }}
              zones={zones}
            />
          </Grid>

          <Grid item xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Events</Typography>
            {dashToEventGrid(events ?? [], rules ?? [])}
          </Grid>

          <Grid item xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Devices</Typography>
            {dashToDeviceGrid(devices ?? [], deviceTypes ?? [])}
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
