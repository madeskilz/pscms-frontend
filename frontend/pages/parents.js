import React from 'react'
import PublicLayout from '../components/PublicLayout'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useTheme } from '../lib/ThemeContext'

function QuickCard({ title, description, href }) {
  const { theme } = useTheme()
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ color: theme.colors.primary }}>{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ flex: 1, lineHeight: 1.7 }}>{description}</Typography>
      <Box>
        <Button component={Link} href={href} variant="contained" size="large" fullWidth sx={{
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          fontWeight: 700,
          py: 1.5
        }}>
          Learn More
        </Button>
      </Box>
    </Paper>
  )
}

export default function ParentsPage() {
  const { theme } = useTheme()
  return (
    <PublicLayout>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" fontWeight={800} color="primary" gutterBottom>Parents & Guardians</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          Quick access to essential information and resources for our parent community
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <QuickCard title="Admissions" description="Enrollment steps, required documents, and contacts." href="/posts/welcome-back" />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickCard title="Calendar" description="Key term dates and upcoming events." href="/posts/sports-day-highlights" />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickCard title="PTA" description="Parent-Teacher Association news and meetings." href="/posts" />
        </Grid>
      </Grid>
    </PublicLayout>
  )
}
