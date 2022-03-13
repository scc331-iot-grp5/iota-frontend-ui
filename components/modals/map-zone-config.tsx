import React from 'react';

import * as M from '../../types/map';
import { dataAPI } from 'redux/data-api';
import { rgbToHex, hexToRGB } from '../../utilities/colour';

import {
  DialogTitle,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { Grid, IconButton, Select, SelectChangeEvent } from '@mui/material';
import * as Icons from '@mui/icons-material';

const ZoneModal: (props: {
  zone: M.Zone;
  groups: M.ZoneGroup[];
  vars: M.ZoneGroupVar[];
  createMode?: boolean;
  userId?: number;
}) => JSX.Element = ({ zone, groups, vars, createMode, userId }) => {
  const [open, setOpen] = React.useState(false);
  const [internalState, setInternalState] = React.useState({
    ...zone,
    id: zone?.id ?? 0,
    chosenColor: zone?.colour ?? { r: 0, g: 0, b: 0 },
    chosenGroup: zone
      ? groups?.find((g) => g.members.includes(zone.id)) ?? null
      : null,
  });
  const [editZone] = dataAPI.endpoints.editZone.useMutation();
  const [createZone] = dataAPI.endpoints.createZone.useMutation();

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
      colour: hexToRGB(event.target.value),
    });
  };
  const handleGeoJSONChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState({
      ...internalState,
      geo_json: JSON.parse(event.target.value),
    });
  };
  const handleGroupChange = (event: SelectChangeEvent) => {
    setInternalState({
      ...internalState,
      chosenGroup:
        event.target.value === '-1'
          ? null
          : groups?.find((g) => g.id === Number(event.target.value)) ?? null,
    });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const saveAndClose = () => {
    if (createMode && userId) {
      createZone({
        name: internalState.name ?? '',
        colour: internalState.colour ?? { r: 0, g: 0, b: 0 },
        geo_json: internalState.geo_json,
        created_by: userId,
        created_at: new Date().toISOString(),
      });
    } else {
      editZone({
        id: internalState.id,
        name: internalState.name,
        colour: internalState.colour,
        geo_json: internalState.geo_json,
      });
      // save zone group
      // save group var values
    }
    setOpen(false);
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        {createMode ? <Icons.AddCircle /> : <Icons.Edit />}
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{createMode ? 'create' : 'edit'} zone</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {!createMode && (
              <Grid item xs={9}>
                <Typography variant="subtitle1">
                  ID: {internalState.id}
                  <br />
                  created at: {internalState.created_at}
                </Typography>
              </Grid>
            )}
            <Grid item xs={3}>
              <InputLabel htmlFor="colour-input-for-zone-config">
                Colour
              </InputLabel>
              <input
                id="colour-input-for-zone-config"
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
                value={internalState.name}
                onChange={handleNameChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                variant="outlined"
                label="geo-json"
                value={JSON.stringify(internalState.geo_json)}
                onChange={handleGeoJSONChange}
              />
            </Grid>

            {!createMode && (
              <>
                <Grid item xs={12}>
                  <Select
                    fullWidth={true}
                    variant="outlined"
                    label="group"
                    value={internalState.chosenGroup?.id.toString() || '-1'}
                    onChange={handleGroupChange}
                  >
                    <MenuItem value={-1}>
                      <em>None</em>
                    </MenuItem>
                    {groups?.map((g) => (
                      <MenuItem key={g.id} value={g.id}>
                        {g.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveAndClose}>
            {createMode ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ZoneModal;
