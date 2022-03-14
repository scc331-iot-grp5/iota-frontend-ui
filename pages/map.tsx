import React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Grid,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Paper,
  IconButton,
  Typography,
  Avatar,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import MapView from '../components/map-view';
import EditZoneModal from '../components/modals/map-zone-config';
import { getUserDetails } from '../types/user-details-local';
import { rgbToHex } from '../utilities/colour';
import ZoneGroupModal from '../components/modals/map-zone-group-config';

/**
 * @return {JSX.Element} the map config view
 */
export default function MapConfig(): JSX.Element {
  const { data: zones } = dataAPI.endpoints.listZones.useQuery(null, {
    pollingInterval: 2000,
  });
  const { data: zoneGroups } = dataAPI.endpoints.listZoneGroups.useQuery(null, {
    pollingInterval: 2000,
  });
  const { data: zoneVars } = dataAPI.endpoints.listZoneVars.useQuery(null, {
    pollingInterval: 2000,
  });

  const [deleteZone] = dataAPI.endpoints.deleteZone.useMutation();
  const [deleteZoneGroup] = dataAPI.endpoints.deleteZoneGroup.useMutation();

  const router = useRouter();
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
    <>
      <Head>
        <title>IOTA: Map Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MapView zones={zones} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">zones</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Colour</TableCell>
                    <TableCell>Geo-JSON Points</TableCell>
                    <TableCell>
                      <EditZoneModal
                        zone={{
                          id: 0,
                          name: 'New Zone',
                          colour: { r: 0, g: 0, b: 0 },
                          geo_json: null,
                          created_at: new Date().toISOString(),
                          created_by: 0,
                        }}
                        groups={zoneGroups ?? []}
                        vars={zoneVars ?? []}
                        createMode={true}
                        userId={getUserDetails()?.id || 0}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {zones?.map((z) => (
                    <TableRow key={z.id}>
                      <TableCell>{z.id}</TableCell>
                      <TableCell>{z.name}</TableCell>
                      <TableCell>
                        <Avatar style={{ backgroundColor: rgbToHex(z.colour) }}>
                          <Icons.CropSquare />
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        {z.geo_json?.features
                          ?.at(0)
                          ?.geometry?.coordinates?.at(0)?.length ?? '<not set>'}
                      </TableCell>

                      <TableCell>
                        <EditZoneModal
                          zone={z}
                          groups={zoneGroups ?? []}
                          vars={zoneVars ?? []}
                        />
                        <IconButton
                          aria-label="remove"
                          onClick={() => deleteZone(z.id)}
                        >
                          <Icons.Remove />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">zone groups</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>
                      <ZoneGroupModal
                        userId={userDetails.id}
                        zoneVars={zoneVars ?? []}
                        zones={zones ?? []}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {zoneGroups?.map((zg) => {
                    return (
                      <TableRow key={zg.id}>
                        <TableCell>{zg.id}</TableCell>
                        <TableCell>{zg.name}</TableCell>
                        <TableCell>
                          {zg.members
                            .map((zId) => zones?.find((z) => z.id === zId))
                            .filter((z) => typeof z !== 'undefined')
                            .map((z) => z?.name ?? '')
                            .join(', ')}
                        </TableCell>

                        <TableCell>
                          <ZoneGroupModal
                            userId={userDetails.id}
                            zones={zones ?? []}
                            zoneVars={zoneVars ?? []}
                            zoneGroup={zg}
                          />
                          <IconButton
                            aria-label="remove"
                            onClick={() => deleteZoneGroup(zg.id)}
                          >
                            <Icons.Remove />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
