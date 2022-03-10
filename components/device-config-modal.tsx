import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as D from '../types/device';

/**
 * @return {JSX.Element} a
 */
const DeviceConfigModal: React.FC<{
  device?: D.Device;
  deviceTypes?: D.Type[];
}> = ({ device, deviceTypes }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [type, setType] = React.useState('');
  const handleChange = (event: SelectChangeEvent) =>
    setType(event.target.value);
  const [loading, setLoading] = React.useState(true);
  const handleTextClick = () => setLoading(false);

  const [name, setName] = React.useState('');
  if (typeof device === 'undefined') {
    return <></>;
  }

  // in this submit would be the code to add the value of textfield to the database
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    alert(`The name you entered was: ${name}`); // test
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <Icons.Edit />
      </IconButton>
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Configuration'}
          <IconButton onClick={handleTextClick}>
            <Icons.Edit />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" variant="h6">
            ID: {device.id}
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 2 }}
          >
            Name: {device.name}
            <TextField
              sx={{ ml: 1, minWidth: 110 }}
              id="filled-basic"
              label="Custom Name"
              variant="filled"
              size="small"
              disabled={loading}
            />
          </DialogContentText>

          <FormControl variant="standard" sx={{ m: 1, mb: 6, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={type}
              onChange={handleChange}
              label="Type"
            >
              {deviceTypes?.map((dt) => (
                <MenuItem key={dt.id} value={30}>
                  {dt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ ml: 1, mt: 2, minWidth: 110 }}
            id="filled-basic"
            label="Custome Type"
            variant="filled"
            size="small"
            value={name}
            onChange={(e: { target: { value: any } }) =>
              setName(e.target.value)
            }
            disabled={loading}
          />
          <Button
            variant="contained"
            sx={{ mt: 3, ml: 1 }}
            onClick={handleSubmit}
          >
            Confirm New Type
          </Button>

          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Compass"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Accelerometer"
            />
            <FormControlLabel
              control={<Checkbox color="success" />}
              label="Temperature"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked disabled color="success" />}
              label="Location"
            />
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Confirm</Button>
          <Button onClick={handleClose}>Close</Button>
          <Icons.InfoOutlined
            sx={{
              position: 'absolute',
              top: 1,
              right: '1%',
            }}
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeviceConfigModal;
