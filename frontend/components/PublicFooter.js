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
    <Box component="footer" sx={{ py: 10, mt: 12, bgcolor: theme.colors.surface, borderTop: `4px solid ${theme.colors.primary}`, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{ width: 56, height: 56, bgcolor: theme.colors.primary, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, boxShadow: 3 }}>
                          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontFamily: theme.fonts.heading }}>S</Typography>
            </Box>
                      <Typography variant="body1" color="text.primary" fontWeight={600} gutterBottom sx={{ fontFamily: theme.fonts.heading }}>
              School CMS
            </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontFamily: theme.fonts.body }}>
              Empowering Nigerian K12 students with quality education and innovative learning experiences.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom sx={{ mb: 2, fontFamily: theme.fonts.heading }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, { label: 'Admin', href: '/admin' }].map(l => (
                <Link key={l.href} component={NextLink} href={l.href} underline="hover" color="text.secondary" variant="body2" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>
                  {l.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom sx={{ mb: 2, fontFamily: theme.fonts.heading }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[{ label: 'Student Portal', href: '#' }, { label: 'Parent Portal', href: '#' }, { label: 'Staff Portal', href: '#' }, { label: 'Library', href: '#' }].map(l => (
                <Link key={l.label} href={l.href} underline="hover" color="text.secondary" variant="body2" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>
                  {l.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom sx={{ mb: 2, fontFamily: theme.fonts.heading }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Link href="mailto:info@school.test" underline="hover" variant="body2" color="text.secondary" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' }, fontFamily: theme.fonts.body }}>
                📧 info@school.test
              </Link>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: theme.fonts.body }}>📞 +234 (0) 123 456 7890</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: theme.fonts.body }}>📍 Lagos, Nigeria</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: theme.colors.accent }} />
        <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontFamily: theme.fonts.body }}>© {currentYear} K12 School CMS. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
            <Link href="#" underline="hover" variant="body2" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Link>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Link href="#" underline="hover" variant="body2" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>Terms of Service</Link>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Link href="#" underline="hover" variant="body2" sx={{ transition: 'color 0.2s', '&:hover': { color: 'primary.main' } }}>Accessibility</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

