import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import PublicNav from './PublicNav'
import PublicFooter from './PublicFooter'
import { useTheme } from '../lib/ThemeContext'

/**
 * PublicLayout wraps public-facing pages with navigation and footer.
 * Props:
 * - children: page content
 * - maxWidth: container maxWidth (default 'lg')
 * - disableContainer: if true, children render without the central Container
 */
export default function PublicLayout({ children, maxWidth = 'lg', disableContainer = false }) {
  const { theme } = useTheme()
  return (
    <Box sx={{ backgroundColor: theme.colors.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <Box component="main" sx={{ flex: 1 }}>
        {disableContainer ? children : (
          <Container maxWidth={maxWidth} sx={{ py: 6 }}>
            {children}
          </Container>
        )}
      </Box>
      <PublicFooter />
    </Box>
  )
}
