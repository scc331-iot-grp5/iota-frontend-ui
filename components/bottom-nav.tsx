import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';

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
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label="Users"
        value="favorites"
        icon={<AccountBoxIcon />}
      />
      <BottomNavigationAction
        label="Devices"
        value="nearby"
        icon={<DevicesOtherIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<FolderIcon />}
      />
    </BottomNavigation>
  );
}
