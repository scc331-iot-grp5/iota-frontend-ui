import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Select,
  SelectChangeEvent,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as D from '../../types/device';
import { Typography } from '@material-ui/core';
import { dataAPI } from '../../redux/data-api';

/**
 * @return {JSX.Element} a
 */
const DeviceConfigModal: React.FC<{
  device: D.Device;
  deviceTypes: D.Type[];
}> = ({ device, deviceTypes }) => {
  const [open, setOpen] = React.useState(false);
  const [localDevice, setLocalDevice] = React.useState(device);
  const [showLatLngEdit, setShowlatLngEdit] = React.useState(false);
  const [localLatLng, setLocalLatLng] = React.useState({
    lat: 0,
    lng: 0,
    update: false,
  });
  const [editDevice] = dataAPI.endpoints.editDevice.useMutation();
  const [setDefaultLoc] =
    dataAPI.endpoints.setDeviceDefaultLocation.useMutation();

  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };
  const reset = () => {
    setLocalLatLng({ lat: 0, lng: 0, update: false });
    setShowlatLngEdit(false);
    setLocalDevice(device);
  };
  const handleCloseNoSave = () => {
    reset();
    setOpen(false);
  };
  const handleCloseWithSave = () => {
    editDevice(localDevice);
    if (localLatLng.update) {
      setDefaultLoc({
        deviceId: localDevice.id,
        lat: localLatLng.lat,
        lng: localLatLng.lng,
      });
    }
    setOpen(false);
  };

  const handleNameEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDevice({ ...localDevice, name: event.target.value });
  };

  const handleSensorEdit =
    (field: keyof D.Config) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalDevice({
        ...localDevice,
        config: { ...localDevice.config, [field]: event.target.checked },
      });
    };

  const handleTypeEdit = (event: SelectChangeEvent<number>) => {
    const {
      target: { value },
    } = event;

    setLocalDevice({
      ...localDevice,
      type_id: typeof value === 'string' ? Number(value) : value,
    });
  };

  const handleShowLL = () => {
    setLocalLatLng({ ...localLatLng, update: true });
    setShowlatLngEdit(true);
  };
  const handleLatLngChange =
    (ll: 'lat' | 'lng') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalLatLng({
        ...localLatLng,
        [ll]: event.target.value,
      });
    };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <Icons.Edit />
      </IconButton>
      <Dialog open={open} onClose={handleCloseNoSave}>
        <DialogTitle>Device Setup</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">ID: {localDevice.id}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={localDevice.name}
                onChange={handleNameEdit}
                label="Display Name"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id={`type-select-label-${localDevice.id}`}>
                  Device Type
                </InputLabel>
                <Select
                  fullWidth
                  labelId={`type-select-label-${localDevice.id}`}
                  value={localDevice.type_id}
                  onChange={handleTypeEdit}
                  label="Device Type"
                >
                  {deviceTypes?.map((dt) => (
                    <MenuItem key={dt.id} value={dt.id}>
                      {dt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Sensors</Typography>
              <FormGroup>
                {localDevice.sensor_set.map((s) => (
                  <FormControlLabel
                    key={s}
                    label={s}
                    control={
                      <Checkbox
                        checked={localDevice.config[s]?.valueOf() ?? false}
                        onChange={handleSensorEdit(s)}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </Grid>

            {showLatLngEdit ? (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    value={localLatLng.lat}
                    onChange={handleLatLngChange('lat')}
                    label="Default Latitude"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    value={localLatLng.lng}
                    onChange={handleLatLngChange('lng')}
                    label="Default Longitude"
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <FormControlLabel
                  label="Set default latitude &amp; longitude"
                  control={
                    <IconButton onClick={handleShowLL}>
                      <Icons.GpsFixed />
                    </IconButton>
                  }
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseNoSave}>cancel</Button>
          <Button onClick={handleCloseWithSave}>save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeviceConfigModal;
