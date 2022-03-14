import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  MenuItem,
  ListItemText,
  FormControl,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as R from '../../types/rule';
import * as M from '../../types/map';
import * as D from '../../types/device';
import { dataAPI } from 'redux/data-api';

const newRule: (userId: number) => R.Rule = (userId) => ({
  id: 0,
  name: 'new rule',
  created_by: userId,
  body: {
    conditions: [],
    events: [],
  },
});

const RuleCreator: React.FC<{
  userId: number;
  devices: D.Device[];
  deviceTypes: D.Type[];
  zones: M.Zone[];
  zoneGroups: M.ZoneGroup[];
  zoneGroupVars: M.ZoneGroupVar[];
}> = ({ userId, devices, deviceTypes, zones, zoneGroups, zoneGroupVars }) => {
  const [nextId, setNextId] = React.useState(0);
  const getId = () => {
    const n = nextId;
    setNextId(nextId + 1);
    return n;
  };

  const [localRule, setLocalRule] = React.useState(newRule(userId));
  const [open, setOpen] = React.useState(false);
  const [enableZoneGroupSelect, setEnableZoneGroupSelect] =
    React.useState(false);
  const [selectedZoneGroupID, setSelectedZoneGroupID] = React.useState(
    localRule.body.zone ?? -1
  );
  const [localConditions, setLocalConditions] = React.useState<
    (R.Condition & { id: number; apply: 'all' | 'one' | 'group' })[]
  >([]);
  const [localEvents, setLocalEvents] = React.useState<
    (R.EventDefinition & { id: number })[]
  >([]);

  const [createRule] = dataAPI.endpoints.createRule.useMutation();

  const reset = () => {
    setLocalRule(newRule(userId));
    setLocalConditions([]);
    setLocalEvents([]);
    setEnableZoneGroupSelect(false);
    setSelectedZoneGroupID(localRule.body.zone ?? -1);
  };

  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };

  const handleCloseNoSave = () => {
    reset();
    setOpen(false);
  };
  const handleCloseWithSave = () => {
    const r: R.Rule = {
      ...localRule,
      body: {
        zone: selectedZoneGroupID === -1 ? undefined : selectedZoneGroupID,
        conditions: localConditions.map((c) => ({
          ...c,
          id: undefined,
          apply: undefined,
        })),
        events: localEvents.map((e) => ({ ...e, id: undefined })),
      },
    };

    createRule(r);
    setOpen(false);
  };

  const handleNameEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRule({ ...localRule, name: event.target.value });
  };

  const toggleHasZoneGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (enableZoneGroupSelect === false) {
      setLocalRule({
        ...localRule,
        body: {
          ...localRule.body,
          zone: selectedZoneGroupID === -1 ? undefined : selectedZoneGroupID,
        },
      });
      setEnableZoneGroupSelect(true);
    } else {
      setLocalRule({
        ...localRule,
        body: { ...localRule.body, zone: undefined },
      });
      setSelectedZoneGroupID(-1);
      setEnableZoneGroupSelect(false);
    }
  };

  const handleZoneGroupIDEdit = (event: SelectChangeEvent<number>) => {
    const {
      target: { value },
    } = event;

    setSelectedZoneGroupID(typeof value === 'string' ? Number(value) : value);
  };

  const handleAddNewCondition = () => {
    setLocalConditions([
      {
        id: getId(),
        fact: D.Sensors[0],
        value: '0',
        operator: 'equals',
        apply: 'all',
      },
      ...localConditions,
    ]);
  };
  const handleRemoveCondition = (id: number) => () => {
    setLocalConditions([...localConditions.filter((c) => c.id !== id)]);
  };
  const handleEditConditionValue =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const toUpdate = localConditions.find((c) => c.id === id);
      if (typeof toUpdate === 'undefined') return;

      setLocalConditions([
        { ...toUpdate, value: event.target.value },
        ...localConditions.filter((c) => c.id !== id),
      ]);
    };
  const handleEditConditionFact =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const toUpdate = localConditions.find((c) => c.id === id);
      if (typeof toUpdate === 'undefined') return;

      setLocalConditions([
        { ...toUpdate, fact: event.target.value as keyof D.Config },
        ...localConditions.filter((c) => c.id !== id),
      ]);
    };
  const handleEditConditionOperator =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const toUpdate = localConditions.find((c) => c.id === id);
      if (typeof toUpdate === 'undefined') return;

      setLocalConditions([
        {
          ...toUpdate,
          operator: event.target.value as typeof R.Comparators[number],
        },
        ...localConditions.filter((c) => c.id !== id),
      ]);
    };
  const handleEditConditionApply =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const toUpdate = localConditions.find((c) => c.id === id);
      if (typeof toUpdate === 'undefined') return;

      setLocalConditions([
        {
          ...toUpdate,
          apply: event.target.value as 'all' | 'one' | 'group',
        },
        ...localConditions.filter((c) => c.id !== id),
      ]);
    };

  const handleEditConditionTarget =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const toUpdate = localConditions.find((c) => c.id === id);
      if (typeof toUpdate === 'undefined') return;

      switch (toUpdate.apply) {
        case 'all':
          setLocalConditions([
            { ...toUpdate, microbitGroup: undefined, microbitID: undefined },
            ...localConditions.filter((c) => c.id !== id),
          ]);
          break;

        case 'group':
          setLocalConditions([
            {
              ...toUpdate,
              microbitGroup: Number(event.target.value),
              microbitID: undefined,
            },
            ...localConditions.filter((c) => c.id !== id),
          ]);
          break;
        case 'one':
          setLocalConditions([
            {
              ...toUpdate,
              microbitGroup: undefined,
              microbitID: Number(event.target.value),
            },
            ...localConditions.filter((c) => c.id !== id),
          ]);
          break;
      }
    };

  const handleAddNewEvent = () => {
    setLocalEvents([
      {
        id: getId(),
        type: 'triggerAlert',
      },
      ...localEvents,
    ]);
  };
  const handleRemoveEvent = (id: number) => () => {
    setLocalEvents(localEvents.filter((e) => e.id !== id));
  };
  const handleEditEventType =
    (id: number) => (event: SelectChangeEvent<HTMLInputElement>) => {
      const newType = event.target.value as
        | 'reportIncident'
        | 'triggerAlert'
        | 'sendMessage';

      switch (newType) {
        case 'reportIncident':
          setLocalEvents([
            { id, type: newType, severity: 0 },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
        case 'triggerAlert':
          setLocalEvents([
            { id, type: newType },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
        case 'sendMessage':
          setLocalEvents([
            { id, type: newType, message: '' },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
      }
    };
  const handleEditEventContent =
    (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const toUpdate = localEvents.find((e) => e.id === id);
      if (typeof toUpdate === undefined) return;

      switch (toUpdate?.type) {
        case 'reportIncident':
          setLocalEvents([
            {
              id: toUpdate.id,
              type: toUpdate.type,
              severity: Number(event.target.value),
            },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
        case 'triggerAlert':
          setLocalEvents([
            { id: toUpdate.id, type: toUpdate.type },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
        case 'sendMessage':
          setLocalEvents([
            {
              id: toUpdate.id,
              type: toUpdate.type,
              message: event.target.value,
            },
            ...localEvents.filter((e) => e.id !== id),
          ]);
          break;
      }
    };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Icons.AddCircle />
      </IconButton>

      <Dialog open={open} onClose={handleCloseNoSave}>
        <DialogTitle>New Rule</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Basic Details</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={localRule.name}
                    onChange={handleNameEdit}
                  />
                </Grid>

                <Grid item xs={4}>
                  <FormControlLabel
                    label="Apply to Zone Group"
                    control={
                      <Checkbox
                        checked={enableZoneGroupSelect}
                        onChange={toggleHasZoneGroup}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <InputLabel id="rule-group-select-label">
                      Applies to Zone Group
                    </InputLabel>
                    <Select
                      disabled={!enableZoneGroupSelect}
                      labelId="rule-group-select-label"
                      input={<OutlinedInput label="Applies to Zone Group" />}
                      onChange={handleZoneGroupIDEdit}
                      value={selectedZoneGroupID}
                    >
                      <MenuItem value={-1}>
                        <ListItemText primary="none" />
                      </MenuItem>
                      {zoneGroups.map((zg) => (
                        <MenuItem key={zg.id} value={zg.id}>
                          <ListItemText
                            primary={zg.name}
                            secondary={`id: ${zg.id}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">Triggering Conditions</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                label="New condition"
                control={
                  <IconButton onClick={handleAddNewCondition}>
                    <Icons.Add />
                  </IconButton>
                }
              />
            </Grid>
            <Grid item xs={12}>
              {localConditions
                .sort((a, b) => a.id - b.id)
                .map((c) => (
                  <>
                    <Grid key={c.id} container spacing={2}>
                      <Grid item xs={2}>
                        <IconButton onClick={handleRemoveCondition(c.id)}>
                          <Icons.Remove />
                        </IconButton>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel id="fact-select-label">Fact</InputLabel>
                          <Select
                            labelId="fact-select-label"
                            value={c.fact as unknown as HTMLInputElement}
                            onChange={handleEditConditionFact(c.id)}
                            label="Fact"
                          >
                            {D.Sensors.map((s) => (
                              <MenuItem key={s} value={s}>
                                {s}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl fullWidth>
                          <InputLabel id="operator-select-label">
                            Operator
                          </InputLabel>
                          <Select
                            labelId="operator-select-label"
                            value={c.operator as unknown as HTMLInputElement}
                            onChange={handleEditConditionOperator(c.id)}
                            label="Operator"
                          >
                            {Object.entries(R.ComparatorSymbols).map(
                              ([name, render]) => (
                                <MenuItem key={name} value={name}>
                                  {render}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Value"
                          value={c.value}
                          onChange={handleEditConditionValue(c.id)}
                        />
                      </Grid>
                      <Grid item xs={2} />
                      <Grid item xs={5}>
                        <FormControl fullWidth>
                          <InputLabel id="apply-type-select-label">
                            Apply To
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="apply-type-select-label"
                            value={c.apply as unknown as HTMLInputElement}
                            onChange={handleEditConditionApply(c.id)}
                            label="Apply To"
                          >
                            <MenuItem value={'all'}>all</MenuItem>
                            <MenuItem value={'one'}>one</MenuItem>
                            <MenuItem value={'group'}>type</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl fullWidth>
                          <InputLabel id="apply-target-select-label">
                            Apply Target
                          </InputLabel>
                          <Select
                            fullWidth
                            input={<OutlinedInput label="Apply Target" />}
                            disabled={c.apply === 'all'}
                            labelId="apply-target-select-label"
                            value={
                              (c.apply === 'all'
                                ? -1
                                : c.apply === 'one'
                                ? c.microbitID ?? -1
                                : c.microbitGroup ??
                                  -1) as unknown as HTMLInputElement
                            }
                            onChange={handleEditConditionTarget(c.id)}
                            label="Apply To"
                          >
                            {c.apply === 'all' ? (
                              <MenuItem value={-1}>
                                <ListItemText primary="none" />
                              </MenuItem>
                            ) : c.apply === 'one' ? (
                              devices.map((d) => (
                                <MenuItem key={d.id} value={d.id}>
                                  <ListItemText
                                    primary={d.name}
                                    secondary={d.id}
                                  />
                                </MenuItem>
                              ))
                            ) : (
                              deviceTypes.map((dt) => (
                                <MenuItem key={dt.id} value={dt.id}>
                                  <ListItemText
                                    primary={dt.name}
                                    secondary={dt.id}
                                  />
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                ))}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1">Emitted Events</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                label="New event"
                control={
                  <IconButton onClick={handleAddNewEvent}>
                    <Icons.Add />
                  </IconButton>
                }
              />
            </Grid>
            <Grid item xs={12}>
              {localEvents
                .sort((a, b) => a.id - b.id)
                .map((e) => (
                  <>
                    <Grid key={e.id} container spacing={2}>
                      <Grid item xs={2}>
                        <IconButton onClick={handleRemoveEvent(e.id)}>
                          <Icons.Remove />
                        </IconButton>
                      </Grid>
                      <Grid item xs={5}>
                        <FormControl fullWidth>
                          <InputLabel id="event-type-select-label">
                            Emit
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="event-type-select-label"
                            value={e.type as unknown as HTMLInputElement}
                            onChange={handleEditEventType(e.id)}
                            label="Emit"
                          >
                            <MenuItem value={'reportIncident'}>
                              Report Incident
                            </MenuItem>
                            <MenuItem value={'triggerAlert'}>
                              Trigger Alert
                            </MenuItem>
                            <MenuItem value={'sendMessage'}>
                              Send Message
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          label={
                            e.type === 'sendMessage'
                              ? 'Message'
                              : e.type === 'reportIncident'
                              ? 'Severity'
                              : 'N/A'
                          }
                          disabled={e.type === 'triggerAlert'}
                          type={
                            e.type === 'reportIncident' ? 'number' : undefined
                          }
                          value={
                            e.type === 'sendMessage'
                              ? e.message
                              : e.type === 'reportIncident'
                              ? e.severity
                              : ''
                          }
                          onChange={handleEditEventContent(e.id)}
                        />
                      </Grid>
                    </Grid>
                    <br />
                  </>
                ))}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseNoSave}>cancel</Button>
          <Button onClick={handleCloseWithSave}>save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RuleCreator;
