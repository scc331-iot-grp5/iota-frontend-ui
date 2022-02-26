import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const top100Films = [
  { label: 'Human' },
  { label: 'Car' },
  { label: 'Infastructure' },
];
export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Types" />}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
