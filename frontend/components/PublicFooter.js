import NextLink from 'next/link'
import { useTheme } from '../lib/ThemeContext'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'

export default function PublicFooter() {
  const { theme } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ py: 8, mt: 8, bgcolor: theme.colors.surface, borderTop: `3px solid ${theme.colors.primary}` }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ width: 48, height: 48, bgcolor: theme.colors.primary, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>S</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Empowering Nigerian K12 students with quality education and innovative learning experiences.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Admin', href: '/admin' }].map(l => (
                <Link key={l.href} component={NextLink} href={l.href} underline="hover" color="text.secondary" variant="body2">
                  {l.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[{ label: 'Student Portal', href: '#' }, { label: 'Parent Portal', href: '#' }, { label: 'Staff Portal', href: '#' }, { label: 'Library', href: '#' }].map(l => (
                <Link key={l.label} href={l.href} underline="hover" color="text.secondary" variant="body2">
                  {l.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link href="mailto:info@school.test" underline="hover" variant="body2" color="text.secondary">
                info@school.test
              </Link>
              <Typography variant="body2" color="text.secondary">+234 (0) 123 456 7890</Typography>
              <Typography variant="body2" color="text.secondary">Lagos, Nigeria</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: theme.colors.accent }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">© {currentYear} K12 School CMS. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
            <Link href="#" underline="hover" variant="caption">Privacy Policy</Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link href="#" underline="hover" variant="caption">Terms of Service</Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link href="#" underline="hover" variant="caption">Accessibility</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

