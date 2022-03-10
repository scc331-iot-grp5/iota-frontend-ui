import * as React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import Bottomnav from '../components/bottom-nav';
import Pop from '../components/device-config-modal';

/**
 * @return {JSX.Element} a
 */
export default function BasicTable(): JSX.Element {
  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 5000 }
  );
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
              <TableCell>Delete</TableCell>
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

                <TableCell>
                  <IconButton>
                    <Icons.Delete />
                  </IconButton>
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
