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
  FormControlLabel,
  Switch,
  Grid,
  IconButton,
} from '@mui/material';
import * as Icons from '@mui/icons-material';

const ZoneModal: (props: {
  zone: M.Zone;
  groups: M.ZoneGroup[];
  vars: M.ZoneGroupVar[];
  varValues: M.ZoneVarValue[];
  createMode?: boolean;
  userId?: number;
}) => JSX.Element = ({ zone, groups, vars, varValues, createMode, userId }) => {
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
  const [setVarValue] = dataAPI.endpoints.setZoneVarValue.useMutation();

  const [localVarValues, setLocalVarValues] = React.useState(
    vars
      .filter(
        (v) =>
          v.group_id ===
          (groups.find((g) => g.members.includes(zone.id))?.id ?? -1)
      )
      .map((v) => ({
        ...v,
        value:
          varValues.find((vv) => vv.var_id === v.id && vv.zone_id === zone.id)
            ?.value ??
          (v.type === 'boolean' ? 'false' : v.type === 'number' ? '0' : ''),
      }))
  );

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

  const handleZoneVarValueChange =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const toUpdate = localVarValues.find((v) => v.id === id);
      if (typeof toUpdate === 'undefined') return;

      setLocalVarValues([
        {
          ...toUpdate,
          value: String(
            toUpdate.type === 'boolean'
              ? event.target.checked
              : event.target.value
          ),
        },
        ...localVarValues.filter((v) => v.id !== id),
      ]);
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
      // save group var values
      for (const v of localVarValues) {
        setVarValue({ var_id: v.id, zone_id: zone.id, value: v.value });
      }
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

            {((g?: M.ZoneGroup) =>
              typeof g === 'undefined' ? (
                <></>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Zone group vars</Typography>
                  </Grid>
                  {localVarValues
                    .sort((a, b) => a.id - b.id)
                    .map((v) => (
                      <React.Fragment key={v.id}>
                        <Grid item xs={12}>
                          {v.type === 'boolean' ? (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={v.value === 'true'}
                                  onChange={handleZoneVarValueChange(v.id)}
                                />
                              }
                              label={v.name}
                            />
                          ) : (
                            <TextField
                              fullWidth={true}
                              label={v.name}
                              type={v.type === 'string' ? 'text' : 'number'}
                              value={v.value}
                              onChange={handleZoneVarValueChange(v.id)}
                            />
                          )}
                        </Grid>
                      </React.Fragment>
                    ))}
                </>
              ))(groups.find((g) => g.members.includes(internalState.id)))}
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
