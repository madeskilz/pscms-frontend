import React from 'react'
import NextLink from 'next/link'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

/**
 * AdminLayout
 * Props:
 * - title: string shown in the AppBar
 * - backHref?: optional href for a back button on the left
 * - rightContent?: node rendered on the right side of the AppBar (e.g., user info)
 * - maxWidth?: MUI Container maxWidth (default 'lg')
 */
export default function AdminLayout({ title, backHref, rightContent, children, maxWidth = 'lg' }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          {backHref && (
            <Button
              component={NextLink}
              href={backHref}
              startIcon={<ArrowBackIcon />}
              color="inherit"
              sx={{ mr: 2 }}
            >
              Back
            </Button>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {title}
          </Typography>
          {rightContent}
        </Toolbar>
      </AppBar>
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}
