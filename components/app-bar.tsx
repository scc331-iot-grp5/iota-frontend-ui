import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { User } from '../types/user';
import { getUserDetails, setUserDetails } from '../types/user-details-local';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar } from '@material-ui/core';
interface State {
  showMenu: boolean;
  showProfileDetails: boolean;
  userDetails: User | null;
}

/**
 * @return {JSX.Element} the App Bar
 */
export default function IOTAAppBar(): JSX.Element {
  const router = useRouter();
  const [acctMenuAnchorEl, acctMenuSetAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [navMenuAnchorEl, navMenuSetAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [values] = React.useState<State>({
    showMenu: false,
    showProfileDetails: false,
    userDetails: getUserDetails(),
  });

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    acctMenuSetAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    acctMenuSetAnchorEl(null);
  };
  const handleLogout = () => {
    handleAccountMenuClose();
    setUserDetails(null);
    router.push('/');
  };

  const handleNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    navMenuSetAnchorEl(event.currentTarget);
  };
  const handleNavMenuClose = () => {
    navMenuSetAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleNavMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={navMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(navMenuAnchorEl)}
            onClose={handleNavMenuClose}
          >
            <MenuItem>
              <Link href="/dash">dashboard</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/device-config">device configuration</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/user-config">user configuration</Link>
            </MenuItem>
            <MenuItem>
              <Link href="/map-config">map configuration</Link>
            </MenuItem>
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IOTA
          </Typography>

          {values.userDetails && (
            <React.Fragment>
              <Typography>{values.userDetails.display_name}</Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenu}
                color="inherit"
              >
                {values.userDetails.profile_url !== null ? (
                  <Avatar src={values.userDetails.profile_url} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </React.Fragment>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={acctMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(acctMenuAnchorEl)}
            onClose={handleAccountMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
