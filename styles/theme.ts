import { createTheme } from '@material-ui/core';

export default createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#546e7a',
    },
    secondary: {
      main: '#b2ebf2',
    },
    error: {
      main: '#e91e63',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#03a9f4',
    },
    success: {
      main: '#43a047',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans,Roboto',
  },
});
