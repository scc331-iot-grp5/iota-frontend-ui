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
  Typography,
  Grid,
  Box,
  Avatar,
  Paper,
  IconButton,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import DeviceModal from '../components/modals/device-config';
import TypeModal from '../components/modals/device-type-config';
import { rgbToHex } from '../utilities/colour';

/**
 * @return {JSX.Element} a
 */
export default function BasicTable(): JSX.Element {
  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 2000 }
  );
  const { data: deviceTypes } = dataAPI.endpoints.listDeviceTypes.useQuery(
    null,
    { pollingInterval: 2000 }
  );
  const [deleteDeviceType] = dataAPI.endpoints.deleteDeviceType.useMutation();
  const handleDeleteDeviceType = (id: number) => () => {
    deleteDeviceType(id);
  };

  return (
    <React.Fragment>
      <Head>
        <title>IOTA: Device Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Typography variant="h6">devices</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Edit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {devices?.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.id}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>
                        {deviceTypes?.filter((dt) => dt.id === d.type_id).at(0)
                          ?.name || 'unknown'}
                      </TableCell>

                      <TableCell>
                        <DeviceModal
                          device={d}
                          deviceTypes={deviceTypes ?? []}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Typography variant="h6">device types</Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Colour</TableCell>
                    <TableCell>
                      <TypeModal />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceTypes?.map((dt) => (
                    <TableRow key={dt.id}>
                      <TableCell>{dt.id}</TableCell>
                      <TableCell>{dt.name}</TableCell>
                      <TableCell>
                        <Avatar
                          style={{ backgroundColor: rgbToHex(dt.colour) }}
                        >
                          <Icons.CropSquare />
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <TypeModal type={dt} />
                        <IconButton onClick={handleDeleteDeviceType(dt.id)}>
                          <Icons.Remove />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
