import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// import Modal from "@mui/material/Modal";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, InputLabel } from '@mui/material';
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

// used for example
const Newdevices = ['0001', '0002', '0003', '0004'];

/**
 * @return {JSX.Element} the dialog
 */
export default function AlertDialog(): JSX.Element {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [personName, setPersonName] = React.useState<string[]>([]);
  const loading = false;

  const handleChangeDrop = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [zone, setZone] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setZone(event.target.value as string);
  };

  const [fact, setFact] = React.useState('');

  const handleFact = (event: SelectChangeEvent) => {
    setFact(event.target.value as string);
  };

  const [operator, setOperator] = React.useState('');

  const handleOperator = (event: SelectChangeEvent) => {
    setOperator(event.target.value as string);
  };

  const [event, setEvent] = React.useState('');

  const handleEvent = (event: SelectChangeEvent) => {
    setEvent(event.target.value as string);
  };

  const [microGroup, setMicroGroup] = React.useState('');

  const handleGroup = (event: SelectChangeEvent) => {
    setMicroGroup(event.target.value as string);
  };

  const [microID, setMicroID] = React.useState('');

  const handleID = (event: SelectChangeEvent) => {
    setMicroID(event.target.value as string);
  };

  const Rule_Preimter = [
    { label: 'Rule perimeter' },
    { label: 'Rule perimeter' },
    { label: 'Rule perimeter' },
  ];
  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <AddIcon />
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
          {'Rule Engine'}
          <IconButton>
            <EditIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mb: 3, minWidth: 120 }}
          >
            <TextField
              id="outlined-basic"
              label="Rule name"
              variant="outlined"
            />
          </DialogContentText>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mb: 6, minWidth: 120 }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Zone</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={zone}
                label="Zone"
                onChange={handleChange}
              >
                <MenuItem value={10}>Zone 1</MenuItem>
                <MenuItem value={20}>Zone 2</MenuItem>
                <MenuItem value={30}>Zone 3</MenuItem>
              </Select>
            </FormControl>
          </DialogContentText>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Fact</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fact}
              label="Fact"
              onChange={handleFact}
            >
              <MenuItem value={10}>Fact 1</MenuItem>
              <MenuItem value={20}>Fact 2</MenuItem>
              <MenuItem value={30}>Fact 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ ml: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">operator</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={operator}
              label="operator"
              onChange={handleOperator}
            >
              <MenuItem value={10}>Operator 1</MenuItem>
              <MenuItem value={20}>Operator 2</MenuItem>
              <MenuItem value={30}>Operator 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ ml: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">MicrobitGroup</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={microGroup}
              label="MicrobitGroup"
              onChange={handleGroup}
            >
              <MenuItem value={10}>MicrobitGroup 1</MenuItem>
              <MenuItem value={20}>MicrobitGroup 2</MenuItem>
              <MenuItem value={30}>MicrobitGroup 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ ml: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">MicrobitID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={microID}
              label="MicrobitID"
              onChange={handleID}
            >
              <MenuItem value={10}>MicrobitID 1</MenuItem>
              <MenuItem value={20}>MicrobitID 2</MenuItem>
              <MenuItem value={30}>MicrobitID 3</MenuItem>
            </Select>
          </FormControl>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mt: 4, mb: 6, minWidth: 120 }}
          >
            <TextField id="outlined-basic" label="Value" variant="outlined" />
            <IconButton onClick={handleClickOpen} sx={{ ml: 2 }}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleClickOpen} sx={{ ml: 2 }}>
              <AddIcon />
            </IconButton>
          </DialogContentText>

          <DialogContentText
            id="alert-dialog-description"
            variant="h6"
            sx={{ mb: 6, mt: 4 }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Event</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={event}
                label="Fact"
                onChange={handleEvent}
              >
                <MenuItem value={10}>Event 1</MenuItem>
                <MenuItem value={20}>Event 2</MenuItem>
                <MenuItem value={30}>Event 3</MenuItem>
              </Select>
              <DialogContentText
                id="alert-dialog-description"
                variant="h6"
                sx={{ mb: 3, mt: 4 }}
              >
                <TextField
                  id="outlined-basic"
                  label="Message/Severity"
                  variant="outlined"
                />
              </DialogContentText>
            </FormControl>
          </DialogContentText>

          <DialogContentText id="alert-dialog-description" variant="h6">
            Rule perimeter
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={Rule_Preimter}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="perimeter" />
              )}
            />
          </DialogContentText>

          <FormControl variant="standard" sx={{ m: 1, mb: 6, minWidth: 120 }}>
            <DialogContentText
              id="alert-dialog-description"
              variant="h6"
              sx={{ mt: 3 }}
            >
              Device for perimeter:
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={personName}
                onChange={handleChangeDrop}
                input={<OutlinedInput label="Tag" />}
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
            <DialogContentText
              id="alert-dialog-description"
              variant="h6"
              sx={{ mt: 3 }}
            >
              <Button onClick={handleClose} variant="contained" color="success">
                Confirm Rule
              </Button>
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
