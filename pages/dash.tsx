import { useRouter } from 'next/router';
import { getUserDetails } from 'types/user-details';
import Link from 'next/link';
import AppBar from '@/components/app-bar';
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import { DashboardData } from 'types/dash-queries';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Typography } from '@material-ui/core';
import MapView from '@/components/map-view';
import { Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface State {
  dashData: DashboardData;
}

/**
 * @param {DashboardData} dash the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToDeviceGrid(dash: DashboardData): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'microbitId', headerName: 'ID' },
    { field: 'sensorType', headerName: 'Type' },
  ];

  return (
    <DataGrid
      rows={dash.devices.map((d, n) => ({ ...d, id: n }))}
      columns={columns}
      pageSize={10}
      autoHeight
    />
  );
}

/**
 * @param {DashboardData} dash the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToCrashGrid(dash: DashboardData): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'microbitId', headerName: 'ID' },
    { field: 'sensorType', headerName: 'Type' },
    { field: 'timestamp', headerName: 'Timestamp' },
  ];

  return (
    <DataGrid
      rows={dash.crashes.map((d, n) => ({
        ...d,
        id: n,
        timestamp: new Date(`${d.date.split('T')[0]}T${d.time}`),
      }))}
      autoHeight
      columns={columns}
      pageSize={10}
    />
  );
}
/**
 * @param {DashboardData} dash the current dashboard
 * @return {DataGrid} the grid!
 */
function dashToReadingGrid(dash: DashboardData): JSX.Element {
  const columns: GridColDef[] = [
    { field: 'microbitId', headerName: 'Device ID' },
    { field: 'sensorType', headerName: 'Type' },
    { field: 'temp', headerName: 'Temperature' },
    { field: 'acc', headerName: 'Acceleration' },
    { field: 'direction', headerName: 'Direction' },
    { field: 'heartbeat', headerName: 'Heartbeat' },
  ];

  return (
    <DataGrid
      rows={dash.readings.map((d, n) => ({
        ...d,
        id: n,
      }))}
      autoHeight
      columns={columns}
      pageSize={10}
    />
  );
}

/**
 * @param {DashboardData} dash the dashboard data
 * @return { any } the extracted placeable items
 */
function dashToPlaceables(
  dash: DashboardData
): { text: string; lat: number; lng: number }[] {
  return dash.locations.map((l) => ({
    text: `device-${l.microbitId}`,
    lat: l.latitude,
    lng: l.longitude,
  }));
}

/**
 * @param {State} values vals
 * @param {React.Dispatch<React.SetStateAction<State>>} setValues setters
 */
function fetchValues(
  values: State,
  setValues: React.Dispatch<React.SetStateAction<State>>
): void {
  fetch('http://localhost:1880/dash')
    .then((res) => res.json())
    .then(
      (res) => {
        console.log('dash data fetched');
        if (res === {}) {
          console.log('no data retrieved');
          return;
        }
        setValues({ ...values, dashData: res });
      },
      (err) => console.log('dashboard data fetch failed', err)
    );
}

/**
 * @return {JSX.Element} the login page
 */
export default function Dash(): JSX.Element {
  const router = useRouter();
  const [values, setValues] = React.useState<State>({
    dashData: {
      crashes: [],
      devices: [],
      readings: [],
      locations: [],
    },
  });

  React.useEffect(() => fetchValues(values, setValues), []);

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

  return (
    <div>
      <Head>
        <title>IOTA: Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <IconButton
        aria-label="refresh"
        size="small"
        onClick={() => fetchValues(values, setValues)}
      >
        <Refresh fontSize="small" />
      </IconButton>

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Map</Typography>
            <MapView placeables={dashToPlaceables(values.dashData)} />
          </Grid>

          <Grid item sm={6} xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Devices</Typography>
            {dashToDeviceGrid(values.dashData)}
          </Grid>
          <Grid item sm={6} xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Crashes</Typography>
            {dashToCrashGrid(values.dashData)}
          </Grid>

          <Grid item xs={12} style={{ height: '50%' }}>
            <Typography variant="h6">Readings</Typography>
            {dashToReadingGrid(values.dashData)}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
