import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import * as Icons from '@mui/icons-material';

/**
 * @return {JSX.Element} the bottom nav
 */
export default function LabelBottomNavigation(): JSX.Element {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      sx={{ width: 500, position: 'absolute', bottom: 1 }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Home"
        value="recents"
        icon={<Icons.Home />}
      />
      <BottomNavigationAction
        label="Users"
        value="favorites"
        icon={<Icons.AccountBox />}
      />
      <BottomNavigationAction
        label="Devices"
        value="nearby"
        icon={<Icons.DevicesOther />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<Icons.Folder />}
      />
    </BottomNavigation>
  );
}
