import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Select,
  SelectChangeEvent,
  IconButton,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Typography,
  Grid,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { User } from 'types/user';
import { Device } from 'types/device';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUserModal: React.FC<{
  user?: User;
  devices: Device[];
}> = ({ user, devices }) => {
  const createMode = !user;
  const localUser: User = user ?? {
    id: 0,
    created_at: '',
    is_administrator: false,
    email: '',
    password_hash: '',
    display_name: '',
    profile_url: '',
    profile_banner: '',
  };
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleCloseNoSave = () => setOpen(false);
  const handleCloseWithSave = () => {
    // todo: save
    setOpen(false);
  };

  const [readableDevices, setReadableDevices] = React.useState<number[]>([]);

  const handleChangeDrop = (
    event: SelectChangeEvent<typeof readableDevices>
  ) => {
    const {
      target: { value },
    } = event;
    setReadableDevices(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        {createMode ? <Icons.AddCircle /> : <Icons.Edit />}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleCloseNoSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Icons.Edit />
          <Typography variant="h6">Edit User</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={localUser.display_name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon URL"
                value={localUser.profile_url}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Banner URL" />
            </Grid>

            {!localUser.is_administrator && (
              <Grid item xs={12}>
                <Typography>Can See Devices:</Typography>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={readableDevices}
                  onChange={handleChangeDrop}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(',  ')}
                  MenuProps={MenuProps}
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.name}>
                      <Checkbox
                        checked={readableDevices.indexOf(device.id) > -1}
                      />
                      <ListItemText
                        primary={device.name}
                        secondary={`id: ${device.id}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseWithSave}>Confirm</Button>
          <Button onClick={handleCloseNoSave}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EditUserModal;
