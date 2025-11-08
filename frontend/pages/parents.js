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
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6" fontWeight={700} sx={{ color: theme.colors.primary }}>{title}</Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>{description}</Typography>
      <Box>
        <Button component={Link} href={href} variant="contained" sx={{
          background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          fontWeight: 600
        }}>
          View
        </Button>
      </Box>
    </Paper>
  )
}

export default function ParentsPage() {
  return (
    <PublicLayout>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>Parents & Guardians</Typography>
        <Typography variant="subtitle1">Quick access to essential information</Typography>
      </Box>
      <Grid container spacing={3}>
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
