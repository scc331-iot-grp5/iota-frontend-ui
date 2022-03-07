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
              <Button onClick={handleClose}>Confirm Rule</Button>
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
