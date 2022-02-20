import '@/styles/global.css';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import theme from '../styles/theme';
// import { ThemeProvider } from '@mui/system;

/**
 * The APP
 * @return {JSX.Element} The app element
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider store={store}>
      <CssBaseline />
      {/* <ThemeProvider theme={theme}> */}
      <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </Provider>
  );
}
