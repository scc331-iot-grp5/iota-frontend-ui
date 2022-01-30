import '@/styles/global.css';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
// import theme from '../styles/theme';
// import { ThemeProvider } from '@mui/system';
import AppBar from '@/components/app-bar';

/**
 * The APP
 * @return {JSX.Element} The app element
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  pageProps['iota-app-bar'] = <AppBar />;

  return (
    <React.Fragment>
      <CssBaseline />
      {/* <ThemeProvider theme={theme}> */}
      <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </React.Fragment>
  );
}
