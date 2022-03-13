import * as React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<ErrorIcon />}
        endIcon={<ErrorIcon />}
      >
        Change Domain
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you would like to switch domains?'}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              position: 'absolute',

              left: '1%',
            }}
            variant="outlined"
            color="success"
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            autoFocus
            variant="outlined"
            color="error"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
