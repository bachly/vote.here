import '../styles/globals.css'
import '../styles/custom.css'
import '../styles/print.css'
import { PrimeReactProvider } from 'primereact/api';

function MyApp({ Component, pageProps }) {
  return <PrimeReactProvider>
    <Component {...pageProps} />
  </PrimeReactProvider>
}


export default MyApp
