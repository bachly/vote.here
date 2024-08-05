import '../styles/globals.css'
import '../styles/custom.css'
import '../styles/print.css'
import { UserProvider } from '../lib/contexts'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


export default MyApp
