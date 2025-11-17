import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Hero({ title, subtitle }) {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="h6" color="text.secondary">{subtitle}</Typography>
        ) : null}
      </Container>
    </Box>
  )
}
