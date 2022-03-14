import React from 'react';
import { dataAPI } from 'redux/data-api';
import {
  Grid,
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
  SelectChangeEvent,
  FormControlLabel,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as M from '../../types/map';

const ZoneGroupModal: React.FC<{
  zoneGroup?: M.ZoneGroup;
  userId: number;
  zones: M.Zone[];
  zoneVars: M.ZoneGroupVar[];
}> = ({ zoneGroup, zoneVars, userId, zones }) => {
  const createMode = typeof zoneGroup === 'undefined';
  const [open, setOpen] = React.useState(false);
  const [localName, setLocalName] = React.useState(
    zoneGroup?.name ?? 'new zone group'
  );
  const [localVars, setLocalVars] = React.useState(
    zoneVars.filter((zv) => zv.group_id === (zoneGroup?.id ?? -1))
  );
  const [localMembers, setLocalMembers] = React.useState(
    zones
      .filter((z) => (zoneGroup?.members ?? []).includes(z.id))
      .map((z) => z.id)
  );
  const [editZoneGroup] = dataAPI.endpoints.editZoneGroup.useMutation();
  const [createZoneGroup] = dataAPI.endpoints.createZoneGroup.useMutation();
  const [createZoneVar] = dataAPI.endpoints.createZoneVar.useMutation();
  const [editZoneVar] = dataAPI.endpoints.editZoneVar.useMutation();
  const [deleteZoneVar] = dataAPI.endpoints.deleteZoneVar.useMutation();
  const [setMembership] =
    dataAPI.endpoints.setZoneGroupMembership.useMutation();

  const reset = () => {
    setLocalName(zoneGroup?.name ?? 'new zone group');
    setLocalVars(
      zoneVars.filter((zv) => zv.group_id === (zoneGroup?.id ?? -1))
    );
    setLocalMembers(
      zones
        .filter((z) => (zoneGroup?.members ?? []).includes(z.id))
        .map((z) => z.id)
    );
  };
  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };
  const saveAndClose = () => {
    if (createMode) {
      createZoneGroup({ name: localName, created_by: userId });
    } else {
      editZoneGroup({ id: zoneGroup.id, name: localName });

      // ! Update Vars
      // delete old
      for (const o of zoneVars
        .filter(
          (zv) =>
            zv.group_id === zoneGroup.id &&
            !localVars.find((lv) => lv.id === zv.id)
        )
        .map((zv) => zv.id)) {
        deleteZoneVar(o);
      }
      // create new
      const created: number[] = [];
      const newVars: M.ZoneGroupVar[] = localVars.filter(
        (lv) =>
          !zoneVars.find(
            (zv) => zv.group_id === zoneGroup.id && lv.id === zv.id
          )
      );
      for (const n of newVars) {
        createZoneVar(n);
        created.push(n.id);
      }
      // update changed
      const updateVars: M.ZoneGroupVar[] = localVars.filter(
        (lv) => !created.includes(lv.id)
      );
      for (const u of updateVars) {
        editZoneVar(u);
      }

      // Update members
      for (const c of [
        ...zoneGroup.members // to remove
          .filter((m) => !localMembers.includes(m))
          .map((m) => ({ zoneId: m, grant: false })),
        ...localMembers // to add
          .filter((m) => !zoneGroup.members.includes(m))
          .map((m) => ({ zoneId: m, grant: true })),
      ]) {
        setMembership({
          group_id: zoneGroup.id,
          zone_id: c.zoneId,
          member: c.grant,
        });
      }
      // remove old
      // add new
    }
    setOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(event.target.value);
  };

  const genTempId = () => Math.max(0, ...localVars.map((v) => v.id)) + 1;
  const handleAddZoneVar = () => {
    if (createMode) return;
    setLocalVars([
      {
        id: genTempId(),
        group_id: zoneGroup.id,
        name: 'new zone var',
        type: 'string',
      },
      ...localVars,
    ]);
  };
  const handleRemoveZoneVar = (id: number) => () => {
    setLocalVars(localVars.filter((v) => v.id !== id));
  };
  const handleZoneVarNameEdit =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const toUpdate = localVars.find((v) => v.id === id);
      if (typeof toUpdate === 'undefined') return;
      setLocalVars([
        { ...toUpdate, name: event.target.value },
        ...localVars.filter((v) => v.id !== id),
      ]);
    };
  const handleZoneVarTypeEdit =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const toUpdate = localVars.find((v) => v.id === id);
      if (typeof toUpdate === 'undefined') return;
      setLocalVars([
        {
          ...toUpdate,
          type: event.target.value as 'number' | 'string' | 'boolean',
        },
        ...localVars.filter((v) => v.id !== id),
      ]);
    };

  const handleMemberSelectChange = (
    event: SelectChangeEvent<typeof localMembers>
  ) => {
    const {
      target: { value },
    } = event;

    setLocalMembers(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        {createMode ? <Icons.AddCircle /> : <Icons.Edit />}
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{createMode ? 'Add' : 'Edit'} Zone Group</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!createMode && (
                <Typography variant="subtitle1">ID: {zoneGroup.id}</Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                variant="outlined"
                label="name"
                value={localName}
                onChange={handleNameChange}
              />
            </Grid>

            {!createMode && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id={`zone-member-select-label-${zoneGroup.id}`}>
                      Members
                    </InputLabel>
                    <Select
                      labelId={`zone-member-select-label-${zoneGroup.id}`}
                      input={<OutlinedInput label="Members" />}
                      fullWidth
                      multiple
                      onChange={handleMemberSelectChange}
                      value={localMembers}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (s) =>
                              zones.find((z) => z.id === s)?.name ?? '<unkown>'
                          )
                          .join(', ')
                      }
                    >
                      {zones.map((zone) => (
                        <MenuItem key={zone.id} value={zone.id}>
                          <Checkbox
                            checked={localMembers.indexOf(zone.id) > -1}
                          />
                          <ListItemText
                            primary={zone.name}
                            secondary={`id: ${zone.id}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1">Group Vars</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label="New group var"
                    control={
                      <IconButton onClick={handleAddZoneVar}>
                        <Icons.Add />
                      </IconButton>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  {localVars
                    .sort((v1, v2) => v1.id - v2.id)
                    .map((v) => (
                      <React.Fragment key={v.id}>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <IconButton onClick={handleRemoveZoneVar(v.id)}>
                              <Icons.Remove />
                            </IconButton>
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              label="Name"
                              value={v.name}
                              onChange={handleZoneVarNameEdit(v.id)}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <FormControl fullWidth>
                              <InputLabel id="type-select-label">
                                Type
                              </InputLabel>
                              <Select
                                labelId="type-select-label"
                                value={v.type as unknown as HTMLInputElement}
                                onChange={handleZoneVarTypeEdit(v.id)}
                                label="Type"
                              >
                                <MenuItem value="number">number</MenuItem>
                                <MenuItem value="string">string</MenuItem>
                                <MenuItem value="boolean">boolean</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <br />
                      </React.Fragment>
                    ))}
                </Grid>
              </>
            )}
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

export default ZoneGroupModal;
