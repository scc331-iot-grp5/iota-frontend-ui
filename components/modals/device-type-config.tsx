import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
  IconButton,
  Grid,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { dataAPI } from 'redux/data-api';
import { hexToRGB, rgbToHex } from 'utilities/colour';
import * as D from '../../types/device';

const newType: () => D.Type = () => ({
  id: -1,
  name: 'new device type',
  colour: { r: 51, g: 102, b: 153 },
});

const DeviceTypeModal: React.FC<{ type?: D.Type }> = ({ type }) => {
  const createMode = typeof type === 'undefined';
  const [localType, setLocalType] = React.useState(type ?? newType());
  const [selectedColour, setSelectedColour] = React.useState(
    typeof type === 'undefined' ? '#336699' : rgbToHex(type.colour)
  );
  const [open, setOpen] = React.useState(false);

  const [createDeviceType] = dataAPI.endpoints.createDeviceType.useMutation();
  const [editDeviceType] = dataAPI.endpoints.editDeviceType.useMutation();

  const reset = () => {
    setLocalType(type ?? newType());
    setSelectedColour(
      typeof type === 'undefined' ? '#336699' : rgbToHex(type.colour)
    );
  };

  const handleOpen = () => {
    reset();
    setOpen(true);
  };
  const handleCloseNoSave = () => {
    reset();
    setOpen(false);
  };
  const handleCloseWithSave = () => {
    const toSave: D.Type = {
      ...localType,
      colour: hexToRGB(selectedColour),
    };

    (typeof type === 'undefined' ? createDeviceType : editDeviceType)(toSave);
    setOpen(false);
  };

  const handleNameEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalType({ ...localType, name: event.target.value });
  };
  const handleColourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColour(event.target.value);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        {createMode ? <Icons.AddCircle /> : <Icons.Edit />}
      </IconButton>

      <Dialog open={open} onClose={handleCloseNoSave}>
        <DialogTitle>{createMode ? 'Add' : 'Edit'} Device Type</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="Name"
                value={localType.name}
                onChange={handleNameEdit}
              />
            </Grid>
            <Grid item xs={3}>
              <InputLabel htmlFor="colour-input-for-type-config">
                Colour
              </InputLabel>
              <input
                id="colour-input-for-type-config"
                type="color"
                value={selectedColour}
                onChange={handleColourChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoSave}>Cancel</Button>
          <Button onClick={handleCloseWithSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceTypeModal;
