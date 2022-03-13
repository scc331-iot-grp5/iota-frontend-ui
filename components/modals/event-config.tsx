import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import * as Icons from '@mui/icons-material';

/**
 * @return {JSX.Element} Modal
 */
export default function Modal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [event, setEvent] = React.useState('');

  const handleEvent = (event: SelectChangeEvent) => {
    setEvent(event.target.value as string);
  };
  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <Icons.Add />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add More Events'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl sx={{ minWidth: 120, mt: 5 }}>
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
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Confirm</Button>
          <Button onClick={handleClose} autoFocus>
            Decline
          </Button>
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
