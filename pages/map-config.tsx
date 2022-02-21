import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@/components/app-bar';
import Grid from '@mui/material/Grid';
import MapView from '@/components/map-view';
import {
  dataAPI,
  useEditZoneMutation,
  useEditZoneGroupMutation,
  useEditZoneVarMutation,
} from 'redux/data-api';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import * as M from '../types/map';
import {
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
} from '@material-ui/core';

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb: (hex: string) => { r: number; g: number; b: number } = (
  hex
) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result === null) {
    return { r: 0, b: 0, g: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const rgbToHex: (rgb: { r: number; g: number; b: number }) => string = ({
  r,
  g,
  b,
}) => {
  const componentToHex: (c: number) => string = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
const EditZoneModal: (props: { zone?: M.Zone }) => JSX.Element = ({ zone }) => {
  const [open, setOpen] = React.useState(false);
  const [internalState, setInternalState] = React.useState({
    ...zone,
    id: zone?.id ?? 0,

    chosenColor: zone ? zone.colour : { r: 0, g: 0, b: 0 },
  });
  const [editZone] = useEditZoneMutation();

  if (typeof zone === 'undefined') {
    return <></>;
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      name: event.target.value,
    });
  };
  const handleColourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      colour: hexToRgb(event.target.value),
    });
  };
  const handleGeoJSONChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      geo_json: JSON.parse(event.target.value),
    });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const saveAndClose = () => {
    editZone({
      id: internalState.id,
      name: internalState.name,
      colour: internalState.colour,
      geo_json: internalState.geo_json,
    });
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Zone</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                ID: {internalState.id} <br /> Created at:{' '}
                {internalState.created_at}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                variant="outlined"
                label="name"
                value={internalState.name}
                onChange={handleNameChange}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Colour</InputLabel>
              <input
                type="color"
                value={rgbToHex(internalState.colour ?? { r: 0, g: 0, b: 0 })}
                onChange={handleColourChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                variant="outlined"
                label="name"
                value={JSON.stringify(internalState.geo_json)}
                onChange={handleGeoJSONChange}
              />
            </Grid>
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

const EditZoneGroupModal: (props: {
  zoneGroup?: M.ZoneGroup;
  zones?: M.Zone[];
}) => JSX.Element = ({ zoneGroup, zones }) => {
  const [open, setOpen] = React.useState(false);
  const [internalState, setInternalState] = React.useState({
    ...zoneGroup,
    id: zoneGroup?.id ?? 0,
  });
  const [editZoneGroup] = useEditZoneGroupMutation();

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
        <EditIcon />
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

const EditZoneGroupVarModal: (props: {
  zoneGroupVar?: M.ZoneGroupVar;
  zoneGroups?: M.ZoneGroup[];
  zones?: M.Zone[];
}) => JSX.Element = ({ zoneGroupVar, zoneGroups, zones }) => {
  const [open, setOpen] = React.useState(false);
  const [internalState, setInternalState] = React.useState({
    ...zoneGroupVar,
    id: zoneGroupVar?.id ?? 0,
  });
  const [editZoneVar] = useEditZoneVarMutation();

  if (typeof zoneGroupVar === 'undefined') {
    return <></>;
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      name: event.target.value,
    });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const saveAndClose = () => {
    editZoneVar({
      id: internalState.id,
      name: internalState.name,
    });
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
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

  return (
    <React.Fragment>
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

          <Grid item xs={12}>
            <Typography variant="h6">zones</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Geo-JSON</TableCell>
                    <TableCell>Edit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {zones?.map((z) => (
                    <TableRow key={z.id}>
                      <TableCell component="th" scope="row">
                        {z.id}
                      </TableCell>
                      <TableCell>{z.name}</TableCell>
                      <TableCell>{JSON.stringify(z.geo_json)}</TableCell>

                      <TableCell>
                        <EditZoneModal zone={z} />
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
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">zone group vars</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Group ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Edit</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {zoneVars?.map((zv) => {
                    return (
                      <TableRow key={zv.id}>
                        <TableCell component="th" scope="row">
                          {zv.id}
                        </TableCell>
                        <TableCell>{zv.group_id}</TableCell>
                        <TableCell>{zv.name}</TableCell>
                        <TableCell>{zv}</TableCell>

                        <TableCell>
                          <EditZoneGroupVarModal
                            zoneGroupVar={zv}
                            zones={zones}
                            zoneGroups={zoneGroups}
                          />
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
    </React.Fragment>
  );
}
