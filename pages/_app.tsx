import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { defaultStore, StoreContext } from '../Store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreContext.Provider value={defaultStore}>
      <Component {...pageProps} />
    </StoreContext.Provider>
  );
}
