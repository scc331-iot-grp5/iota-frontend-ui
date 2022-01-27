import '@/styles/global.css';
import type { AppProps } from 'next/app';

/**
 * The APP
 * @return {JSX.Element} The app element
 */
export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
