import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  FormControl,
  TextField,
  Select,
  SelectChangeEvent,
  IconButton,
  Checkbox,
  OutlinedInput,
  ListItemText,
} from '@mui/material';
import * as Icons from '@mui/icons-material';

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

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <Icons.Edit />
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
          <IconButton>
            <Icons.Edit />
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
          </FormControl>
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
}
