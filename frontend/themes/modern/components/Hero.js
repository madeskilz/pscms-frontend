import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Hero({ title, subtitle }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>
        ) : null}
      </Container>
    </Box>
  )
}
