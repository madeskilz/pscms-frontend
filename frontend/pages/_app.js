import '../styles/globals.css'
import '../styles/themes.css'
import Head from 'next/head'
import { ThemeProvider } from '../lib/ThemeContext'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }) {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Quicksand:wght@600;700&display=swap" rel="stylesheet" />
                </Head>
                <Component {...pageProps} />
            </ThemeProvider>
        </ErrorBoundary>
    )
}
