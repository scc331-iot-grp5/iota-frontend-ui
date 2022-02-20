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
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
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

//used for example
const Newdevices = ['0001', '0002', '0003', '0004'];

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
  };
  const [loading, setLoading] = React.useState(true);
  function handleTextClick() {
    setLoading(false);
  }

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChangeDrop = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
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
        <DialogTitle id="alert-dialog-title">
          {'User Detail'}
          <IconButton onClick={handleTextClick}>
            <EditIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" variant="h6">
            Name: Nima
            <TextField
              sx={{ ml: 1, minWidth: 110 }}
              id="filled-basic"
              label="Edit Name"
              variant="filled"
              size="small"
              disabled={loading}
            />
          </DialogContentText>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 3 }}
          >
            ID: 0000
            <TextField
              sx={{ ml: 5.5, minWidth: 110 }}
              id="filled-basic"
              label="Edit ID"
              variant="filled"
              size="small"
              disabled={loading}
            />
          </DialogContentText>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 3 }}
          >
            Icon URL:
            <TextField
              sx={{ ml: 5, minWidth: 110 }}
              id="filled-basic"
              label="Edit Icon URL"
              variant="filled"
              size="small"
              disabled={loading}
            />
          </DialogContentText>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 4 }}
          >
            Banner URL:
            <TextField
              sx={{ ml: 2.6, minWidth: 50 }}
              id="filled-basic"
              label="Edit Banner URL"
              variant="filled"
              size="small"
              disabled={loading}
            />
          </DialogContentText>

          <FormControl variant="standard" sx={{ m: 1, mb: 6, minWidth: 120 }}>
            <DialogContentText
              id="alert-dialog-description"
              variant="h6"
              sx={{ mt: 3 }}
            >
              New Device:
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChangeDrop}
                nput={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(',  ')}
                MenuProps={MenuProps}
              >
                {Newdevices.map((device) => (
                  <MenuItem key={device} value={device}>
                    <Checkbox checked={personName.indexOf(device) > -1} />
                    <ListItemText primary={device} />
                  </MenuItem>
                ))}
              </Select>
            </DialogContentText>
          </FormControl>
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
