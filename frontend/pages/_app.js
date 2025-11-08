import '../styles/globals.css'
import { ThemeProvider } from '../lib/ThemeContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }) {
  return (
      <ErrorBoundary>
          <ThemeProvider>
              <Component {...pageProps} />
          </ThemeProvider>
      </ErrorBoundary>
  )
}
