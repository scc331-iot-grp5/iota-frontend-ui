import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pop from '../components/device-config-modal';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import AppBar from '@/components/app-bar';
import Bottomnav from '../components/bottom-nav';
// import { useRouter } from 'next/router';

/**
 * @return {JSX.Element} a
 */
export default function BasicTable(): JSX.Element {
  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: deviceTypes } = dataAPI.endpoints.listDeviceTypes.useQuery(
    null,
    { pollingInterval: 5000 }
  );

  return (
    <React.Fragment>
      <Head>
        <title>IOTA: Device Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {devices?.map((d) => (
              <TableRow
                key={d.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {d.id}
                </TableCell>
                <TableCell align="right">{d.name}</TableCell>
                <TableCell align="right">
                  {deviceTypes?.filter((dt) => dt.id === d.type_id).at(0)
                    ?.name || 'unknown'}
                </TableCell>

                <TableCell>
                  <Pop device={d} deviceTypes={deviceTypes ?? []} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Bottomnav />
    </React.Fragment>
  );
}
