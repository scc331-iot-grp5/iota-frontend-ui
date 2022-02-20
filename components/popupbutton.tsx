import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
// import Modal from "@mui/material/Modal";
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as D from '../types/device';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MapView from '@/components/map-view';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
interface State {
  devices: D.Device[];
  device_types: D.Type[];
}

// function dashToPlaceables(
//   dash: DashboardData
// ): { text: string; lat: number; lng: number }[] {
//   return dash.locations.map((l) => ({
//     text: `device-${l.microbitId}`,
//     lat: l.latitude,
//     lng: l.longitude,
//   }));
// }

function fetchValues(
  values: State,
  setValues: React.Dispatch<React.SetStateAction<State>>
): void {
  fetch('http://localhost:1880/Device')
    .then((res) => res.json())
    .then(
      (res) => {
        console.log('Configuration data fetched');
        if (res === {}) {
          console.log('no data retrieved');
          return;
        }
        setValues({ ...values, devices: res });
      },
      (err) => console.log('Configuration data fetch failed', err)
    );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [type, setType] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
    // if (event.target.value="30")
    // {
    //   (React.useState(true))
    // }
  };
  const [loading, setLoading] = React.useState(true);
  function handleTextClick() {
    setLoading(false);
  }
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <React.Fragment>
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Configuration
      </Button> */}
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Configuration'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" variant="h6">
            ID: 0000
          </DialogContentText>
          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 2 }}
          >
            Name: Custom
            {/* <Button
                sx={{ ml: 1, minWidth: 110, height: 50 }}
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleTextClick}
              >
                Edit
              </Button> */}
            <IconButton onClick={handleTextClick}>
              <EditIcon />
            </IconButton>
            <TextField
              sx={{ ml: 1, minWidth: 110 }}
              id="filled-basic"
              label="Custome Name"
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
              <MenuItem value="">{/* <em>None</em> */}</MenuItem>
              <MenuItem value={10}>Human</MenuItem>
              <MenuItem value={20}>Car</MenuItem>
              <MenuItem value={30}>Infastructure</MenuItem>
            </Select>
          </FormControl>

          {/* <Chip
            label="Compass"
            variant="outlined"
            color="primary"
            onClick={handleClick}
            sx={{ ml: 1, minWidth: 110 }}
            InfoOutlinedIcon
          />
          <Chip
            label="location"
            variant="outlined"
            color="primary"
            onClick={handleClick}
            disabled
            sx={{ ml: 1, minWidth: 110 }}
          />
          <Chip
            label="Accelerometer"
            variant="outlined"
            color="primary"
            onClick={handleClick}
            sx={{ ml: 1, minWidth: 110 }}
          />
          <Chip
            label="Temperture"
            variant="outlined"
            color="primary"
            onClick={handleClick}
            sx={{ ml: 1, minWidth: 110 }}
          />
          <Chip
            label="Sound"
            variant="outlined"
            color="primary"
            onClick={handleClick}
            sx={{ ml: 1, minWidth: 110 }}
          /> */}
          {/* Backup design */}
          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Compass"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Location"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Accelerometer"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Temperture"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked color="success" />}
              label="Sound"
            />
          </FormGroup>

          {/* <Box sx={{visibility:{handleChange}}}>
          <MapView placeables={dashToPlaceables(values.dashData)} />
          </Box> */}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Confirm</Button>
          <Button onClick={handleClose}>Close</Button>
          <InfoOutlinedIcon
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
}
