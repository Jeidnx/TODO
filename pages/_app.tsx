import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  //TODO: Check if user is logged in
  return <Component {...pageProps} />
}

export default MyApp
