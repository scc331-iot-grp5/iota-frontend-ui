import * as React from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
  Select,
  IconButton,
  Checkbox,
  ListItemText,
  Typography,
  Grid,
  SelectChangeEvent,
  OutlinedInput,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { ReadRight, User } from '../../types/user';
import { Device } from '../../types/device';
import { dataAPI } from '../../redux/data-api';

const newUser: () => User = () => ({
  id: 0,
  created_at: new Date().toISOString(),
  is_administrator: false,
  email: '',
  password_hash: '',
  display_name: 'new user',
  profile_url:
    'https://commons.wikimedia.org/wiki/File:BSicon_extkBHFl%2B4_teal.svg',
  profile_banner: '',
});

const EditUserModal: React.FC<{
  user?: User;
  devices: Device[];
  readRights?: ReadRight[];
}> = ({ user, devices, readRights }) => {
  const createMode = !user;

  const [localUser, setLocalUser] = React.useState(user ?? newUser());
  const [localReadRightIDs, setLocalReadRightIDs] = React.useState(
    readRights
      ?.filter((rr) => rr.user_id === localUser.id)
      ?.map((rr) => rr.device_id) ?? []
  );
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [editUser] = dataAPI.endpoints.editUser.useMutation();
  const [createUser] = dataAPI.endpoints.createUser.useMutation();
  const [grantReadRight] = dataAPI.endpoints.grantReadToUser.useMutation();

  const reset = () => {
    setLocalUser(user ?? newUser());
    setLocalReadRightIDs(
      readRights
        ?.filter((rr) => rr.user_id === localUser.id)
        ?.map((rr) => rr.device_id) ?? []
    );
  };
  const handleClickOpen = () => setOpen(true);
  const handleCloseNoSave = () => {
    reset();
    setOpen(false);
  };
  const handleCloseWithSave = () => {
    // save user deets
    (createMode ? createUser : editUser)(localUser);

    // save rr differences
    const allReadables =
      readRights
        ?.filter((rr) => rr.user_id === localUser.id)
        ?.map((rr) => rr.device_id) ?? [];

    const changes = [
      ...allReadables // to remove
        .filter((rr) => !localReadRightIDs.includes(rr))
        .map((rr) => ({ deviceId: rr, grant: false })),
      ...localReadRightIDs // to add
        .filter((rr) => !allReadables.includes(rr))
        .map((rr) => ({ deviceId: rr, grant: true })),
    ];

    for (const c of changes) {
      grantReadRight({
        ...c,
        userId: localUser.id,
      });
    }

    setOpen(false);
  };

  const handleReadRightEdit = (
    event: SelectChangeEvent<typeof localReadRightIDs>
  ) => {
    const {
      target: { value },
    } = event;

    setLocalReadRightIDs(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  };

  const handleNameEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, display_name: event.target.value });
  };
  const handleEmailEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, email: event.target.value });
  };
  const handlePasswordEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, password_hash: event.target.value });
  };
  const handleIconURLEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, profile_url: event.target.value });
  };
  const handleBannerURLEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, profile_banner: event.target.value });
  };
  const handleIsAdminEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, is_administrator: event.target.checked });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        {createMode ? <Icons.AddCircle /> : <Icons.Edit />}
      </IconButton>
      <Dialog open={open} onClose={handleCloseNoSave}>
        <DialogTitle>
          <Avatar src={localUser.profile_url || undefined} />
          <Typography>Edit User</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Name"
                value={localUser.display_name}
                onChange={handleNameEdit}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localUser.is_administrator}
                    icon={<Icons.GppBadOutlined />}
                    checkedIcon={<Icons.GppGood />}
                    color="primary"
                    onChange={handleIsAdminEdit}
                  />
                }
                label="Administrator"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={localUser.email}
                onChange={handleEmailEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor={`edit-password-for-${localUser.id}`}>
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id={`edit-password-for-${localUser.id}`}
                type={showPassword ? 'text' : 'password'}
                value={localUser.password_hash}
                onChange={handlePasswordEdit}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Icons.VisibilityOff />
                      ) : (
                        <Icons.Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon URL"
                value={localUser.profile_url}
                onChange={handleIconURLEdit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner URL"
                value={localUser.profile_banner}
                onChange={handleBannerURLEdit}
              />
            </Grid>

            {!localUser.is_administrator && (
              <Grid item xs={12}>
                <InputLabel id={`device-read-select-label-${localUser.id}`}>
                  Viewable Devices
                </InputLabel>
                <Select
                  labelId={`device-read-select-label-${localUser.id}`}
                  input={<OutlinedInput label="Viewable Devices" />}
                  fullWidth
                  multiple
                  onChange={handleReadRightEdit}
                  value={localReadRightIDs}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (s) =>
                          devices.find((d) => d.id === s)?.name ?? '<unkown>'
                      )
                      .join(', ')
                  }
                >
                  {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>
                      <Checkbox
                        checked={localReadRightIDs.indexOf(device.id) > -1}
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
