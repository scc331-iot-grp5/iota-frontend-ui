import React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
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
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Avatar,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import MapView from '../components/map-view';
import EditZoneModal from '../components/map-zone-config-modal';
import * as M from '../types/map';
import { getUserDetails } from '../types/user-details-local';
import { rgbToHex } from '../utilities/colour';

const EditZoneGroupModal: (props: {
  zoneGroup?: M.ZoneGroup;
  zones?: M.Zone[];
}) => JSX.Element = ({ zoneGroup, zones }) => {
  const [open, setOpen] = React.useState(false);
  const [internalState, setInternalState] = React.useState({
    ...zoneGroup,
    id: zoneGroup?.id ?? 0,
  });
  const [editZoneGroup] = dataAPI.endpoints.editZoneGroup.useMutation();

  if (typeof zoneGroup === 'undefined') {
    return <></>;
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      name: event.target.value,
    });
  };

  // const handleMembersChange = (event: SelectChangeEvent<string[]>) => {
  //   const { target: value } = event;
  // };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const saveAndClose = () => {
    editZoneGroup({
      id: internalState.id,
      name: internalState.name,
    });
    setOpen(false);
  };
  return (
    <>
      <IconButton disabled onClick={handleClickOpen}>
        <Icons.Edit />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Zone Group</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                ID: {internalState.id}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                variant="outlined"
                label="name"
                value={internalState.name ?? ''}
                onChange={handleNameChange}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="edit-zone-group-members-label">
                Members
              </InputLabel>
              <Select
                labelId="edit-zone-group-members-label"
                fullWidth={true}
                variant="outlined"
                label="name"
                value={internalState?.members?.join(', ') ?? ''}
              >
                {zones?.map((z) => (
                  <MenuItem key={z.id}>
                    <Checkbox checked={internalState.members?.includes(z.id)} />
                    <ListItemText primary={z.name} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveAndClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

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
                      <TableCell component="th" scope="row">
                        {z.id}
                      </TableCell>
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
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>Edit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {zoneGroups?.map((zg) => {
                    return (
                      <TableRow key={zg.id}>
                        <TableCell component="th" scope="row">
                          {zg.id}
                        </TableCell>
                        <TableCell>{zg.name}</TableCell>
                        <TableCell>
                          {zg.members
                            .map((zId) => zones?.find((z) => z.id === zId))
                            .filter((z) => typeof z !== 'undefined')
                            .map((z) => z?.name ?? '')
                            .join(', ')}
                        </TableCell>

                        <TableCell>
                          <EditZoneGroupModal zoneGroup={zg} zones={zones} />
                          <IconButton aria-label="remove">
                            {/* TODO: Removal hook */}
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
